import { OrderSide } from '@secured-finance/sf-client';
import { toBytes32 } from '@secured-finance/sf-graph-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients/';
import { VisibilityState } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    AdvancedLendingTopBar,
    HorizontalTabTable,
    TabSelector,
} from 'src/components/molecules';
import {
    ActiveTradeTable,
    AdvancedLendingOrderCard,
    HistoricalWidget,
    MultiLineChartTab,
    MyTransactionsTable,
    NewOrderBookWidget,
    OrderHistoryTable,
    OrderTable,
    RecentTradesTable,
} from 'src/components/organisms';
import { TableType, Toolbar } from 'src/components/pages';
import { ThreeColumnsWithTopBar } from 'src/components/templates';
import {
    CollateralBook,
    MarketPhase,
    baseContracts,
    emptyOrderList,
    useBorrowOrderBook,
    useBreakpoint,
    useCurrencies,
    useCurrenciesForOrders,
    useGraphClientHook,
    useIsSubgraphSupported,
    useIsUnderCollateralThreshold,
    useItayoseEstimation,
    useLastPrices,
    useLendOrderBook,
    useLendingMarkets,
    useMarket,
    useMarketOrderList,
    useMarketPhase,
    useOrderList,
    usePositions,
    useYieldCurveMarketRates,
    useYieldCurveMarketRatesHistorical,
} from 'src/hooks';
import { useOrderbook } from 'src/hooks/useOrderbook';
import useSF from 'src/hooks/useSecuredFinance';
import {
    resetAmount,
    resetUnitPrice,
    selectLandingOrderForm,
    setCurrency,
    setMaturity,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import {
    DailyMarketInfo,
    MaturityOptionList,
    TransactionList,
} from 'src/types';
import {
    ButtonEvents,
    ButtonProperties,
    CurrencySymbol,
    ZERO_BI,
    checkOrderIsFilled,
    currencyMap,
    formatLoanValue,
    formatOrders,
    formatWithCurrency,
    getMappedOrderStatus,
    hexToCurrencySymbol,
    sortOrders,
    toOptions,
    usdFormat,
} from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import { trackButtonEvent } from 'src/utils/events';
import { useAccount } from 'wagmi';

const useTradeHistoryDetails = (
    transactions: TransactionList,
    currency: CurrencySymbol,
    maturity: Maturity
) => {
    return useMemo(() => {
        let min = 10000;
        let max = 0;
        let sum = ZERO_BI;

        if (!transactions.length) {
            min = 0;
            max = 0;
        }

        for (const t of transactions) {
            const price = +t.executionPrice;
            if (price < min) {
                min = price;
            }
            if (price > max) {
                max = price;
            }
            sum += BigInt(t.amount);
        }

        return {
            min: LoanValue.fromPrice(min, maturity.toNumber()),
            max: LoanValue.fromPrice(max, maturity.toNumber()),
            sum: currencyMap[currency].fromBaseUnit(sum),
        };
    }, [currency, maturity, transactions]);
};

export const AdvancedLending = ({
    collateralBook,
    maturitiesOptionList,
    marketPrice,
    delistedCurrencySet,
    setIsItayose,
    setMaximumOpenOrderLimit,
    setPreOrderDays,
}: {
    collateralBook: CollateralBook;
    maturitiesOptionList: MaturityOptionList;
    marketPrice: number | undefined;
    delistedCurrencySet: Set<CurrencySymbol>;
    setIsItayose: (value: boolean) => void;
    setMaximumOpenOrderLimit: (value: boolean) => void;
    setPreOrderDays: (value: number | undefined) => void;
}) => {
    const isTablet = useBreakpoint('laptop');
    const { currency, maturity } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );
    const [timestamp, setTimestamp] = useState<number>(1643713200);
    const [isChecked, setIsChecked] = useState(false);

    const dispatch = useDispatch();
    const { address } = useAccount();
    const { data: priceList } = useLastPrices();
    const { data: usedCurrencies = [] } = useCurrenciesForOrders(address);
    const { data: fullPositions } = usePositions(address, usedCurrencies);

    const { data: lendingMarkets = baseContracts } = useLendingMarkets();
    const lendingContracts = lendingMarkets[currency];

    const marketPhase = useMarketPhase(currency, maturity);
    const isItayosePeriod =
        marketPhase === MarketPhase.ITAYOSE ||
        marketPhase === MarketPhase.PRE_ORDER;
    const [selectedTable, setSelectedTable] = useState(
        isItayosePeriod ? TableType.OPEN_ORDERS : TableType.ACTIVE_POSITION
    );

    const selectedTerm = useMemo(() => {
        return (
            maturitiesOptionList.find(option =>
                option.value.equals(new Maturity(maturity))
            ) || maturitiesOptionList[0]
        );
    }, [maturity, maturitiesOptionList]);

    const { data: itayoseEstimation } = useItayoseEstimation(
        currency,
        maturity
    );

    const estimatedOpeningUnitPrice = lendingMarkets[currency][maturity]
        ?.openingUnitPrice
        ? LoanValue.fromPrice(
              lendingMarkets[currency][maturity]?.openingUnitPrice ?? 0,
              maturity,
              lendingContracts[selectedTerm.value.toNumber()]?.utcOpeningDate
          )
        : undefined;

    const filteredOrderList = useMarketOrderList(
        address,
        currency,
        maturity,
        (o: { isPreOrder: boolean }) => o.isPreOrder
    ).map(o => {
        return {
            ...o,
            calculationDate: lendingContracts[maturity]?.utcOpeningDate,
        };
    });

    const positions = isChecked
        ? fullPositions?.positions
        : fullPositions?.positions.filter(
              position =>
                  position.maturity === maturity.toString() &&
                  hexToCurrencySymbol(position.currency) === currency
          );

    const { data: fullOrderList = emptyOrderList } = useOrderList(
        address,
        usedCurrencies
    );
    const orderList = isChecked
        ? fullOrderList.activeOrderList
        : fullOrderList.activeOrderList.filter(
              o =>
                  o.maturity === maturity.toString() &&
                  hexToCurrencySymbol(o.currency) === currency
          );

    const currencyPrice = priceList[currency];
    const { data: currencies } = useCurrencies();
    const assetList = toOptions(currencies, currency);

    const securedFinance = useSF();
    const currentChainId = securedFinance?.config.chain.id;
    const isSubgraphSupported = useIsSubgraphSupported(currentChainId);

    useEffect(() => {
        setTimestamp(Math.round(new Date().getTime() / 1000));
    }, []);

    const filteredInactiveOrderList = useMemo(() => {
        return isChecked
            ? fullOrderList.inactiveOrderList
            : fullOrderList.inactiveOrderList.filter(
                  o =>
                      o.maturity === maturity.toString() &&
                      hexToCurrencySymbol(o.currency) === currency
              );
    }, [isChecked, fullOrderList.inactiveOrderList, maturity, currency]);

    const isUnderCollateralThreshold = useIsUnderCollateralThreshold(address);

    const filteredUserOrderHistory = useGraphClientHook(
        {
            address: address?.toLowerCase() ?? '',
            currency: toBytes32(currency),
            maturity: maturity,
        },
        queries.FilteredUserOrderHistoryDocument,
        'user',
        selectedTable !== TableType.ORDER_HISTORY || isChecked
    );

    const fullUserOrderHistory = useGraphClientHook(
        {
            address: address?.toLowerCase() ?? '',
        },
        queries.FullUserOrderHistoryDocument,
        'user',
        selectedTable !== TableType.ORDER_HISTORY || !isChecked
    );

    const userOrderHistory = isItayosePeriod
        ? filteredUserOrderHistory
        : isChecked
        ? fullUserOrderHistory
        : filteredUserOrderHistory;

    const filteredUserTransactionHistory = useGraphClientHook(
        {
            address: address?.toLowerCase() ?? '',
            currency: toBytes32(currency),
            maturity: maturity,
        },
        queries.FilteredUserTransactionHistoryDocument,
        'user',
        selectedTable !== TableType.MY_TRANSACTIONS || isChecked
    );

    const fullUserTransactionHistory = useGraphClientHook(
        {
            address: address?.toLowerCase() ?? '',
        },
        queries.FullUserTransactionHistoryDocument,
        'user',
        selectedTable !== TableType.MY_TRANSACTIONS || !isChecked
    );

    const userTransactionHistory = isChecked
        ? fullUserTransactionHistory
        : filteredUserTransactionHistory;

    const sortedOrderHistory = useMemo(() => {
        const baseOrders = userOrderHistory.data?.orders || [];

        const mappedOrders = baseOrders.map(order => {
            const status = isItayosePeriod
                ? getMappedOrderStatus(order)
                : checkOrderIsFilled(order, filteredInactiveOrderList)
                ? 'Filled'
                : getMappedOrderStatus(order);

            return {
                ...order,
                status,
                ...(status === 'Filled'
                    ? { filledAmount: order.inputAmount }
                    : {}),
            } as typeof order & { status: string; filledAmount?: string };
        });

        return mappedOrders.sort(sortOrders);
    }, [
        isItayosePeriod,
        userOrderHistory.data?.orders,
        filteredInactiveOrderList,
    ]);

    const myTransactions = useMemo(() => {
        const tradesFromCon = formatOrders(filteredInactiveOrderList);
        return [
            ...tradesFromCon,
            ...(userTransactionHistory.data?.transactions || []),
        ];
    }, [filteredInactiveOrderList, userTransactionHistory.data?.transactions]);

    const data = useMarket(currency, maturity);

    const marketUnitPrice = data?.marketUnitPrice;
    const openingUnitPrice = data?.openingUnitPrice;
    const {
        data: borrowAmount,
        isPending: isPendingBorrow,
        fetchStatus: borrowFetchStatus,
    } = useBorrowOrderBook(
        currency,
        maturity,
        Number(itayoseEstimation?.lastBorrowUnitPrice ?? ZERO_BI)
    );

    const {
        data: lendAmount,
        isPending: isPendingLend,
        fetchStatus: lendFetchStatus,
    } = useLendOrderBook(
        currency,
        maturity,
        Number(itayoseEstimation?.lastLendUnitPrice ?? ZERO_BI)
    );

    const isLoadingMap = {
        [OrderSide.BORROW]: isPendingBorrow && borrowFetchStatus !== 'idle',
        [OrderSide.LEND]: isPendingLend && lendFetchStatus !== 'idle',
    };

    const orderbookArgs = useMemo<Parameters<typeof useOrderbook>>(() => {
        if (!isItayosePeriod) {
            return [currency, maturity];
        }

        const contract = lendingContracts[selectedTerm.value.toNumber()];
        return [
            currency,
            maturity,
            contract?.utcOpeningDate,
            itayoseEstimation?.lastBorrowUnitPrice,
            borrowAmount,
            itayoseEstimation?.lastLendUnitPrice,
            lendAmount,
        ];
    }, [
        borrowAmount,
        currency,
        isItayosePeriod,
        itayoseEstimation?.lastBorrowUnitPrice,
        itayoseEstimation?.lastLendUnitPrice,
        lendAmount,
        lendingContracts,
        maturity,
        selectedTerm.value,
    ]);

    const [orderBook, setMultiplier, setIsShowingAll] = useOrderbook(
        ...orderbookArgs
    );

    const { data: transactionHistory } = useGraphClientHook(
        {
            currency: toBytes32(currency),
            maturity: maturity,
            from: timestamp - 24 * 3600,
            to: timestamp,
            sides: [OrderSide.LEND, OrderSide.BORROW],
        },
        queries.TransactionHistoryDocument,
        'transactionHistory',
        !isSubgraphSupported
    );

    const selectedAsset = useMemo(() => {
        return (
            assetList.find(option => option.value === currency) || assetList[0]
        );
    }, [currency, assetList]);

    const tradeHistoryDetails = useTradeHistoryDetails(
        transactionHistory ?? [],
        currency,
        selectedTerm.value
    );

    const dailyMarketInfo = {
        high: formatLoanValue(tradeHistoryDetails.max, 'price'),
        low: formatLoanValue(tradeHistoryDetails.min, 'price'),
        volume: formatWithCurrency(
            tradeHistoryDetails.sum || 0,
            selectedAsset?.value as CurrencySymbol,
            currencyMap[selectedAsset?.value as CurrencySymbol]?.roundingDecimal
        ),
        volumeInUSD: usdFormat(currencyPrice * tradeHistoryDetails.sum),
    } as DailyMarketInfo;

    const {
        rates,
        maturityList,
        itayoseMarketIndexSet,
        maximumRate,
        marketCloseToMaturityOriginalRate,
    } = useYieldCurveMarketRates();

    const currentMarket = useMemo(() => {
        if (marketUnitPrice) {
            return {
                value: LoanValue.fromPrice(marketUnitPrice, maturity),
                time: data?.lastBlockUnitPriceTimestamp ?? 0,
                type: 'block' as const,
            };
        }
        if (openingUnitPrice) {
            return {
                value: LoanValue.fromPrice(openingUnitPrice, maturity),
                time: 0,
                type: 'opening' as const,
            };
        }
    }, [
        data?.lastBlockUnitPriceTimestamp,
        marketUnitPrice,
        maturity,
        openingUnitPrice,
    ]);

    const { historicalRates, loading: ratesLoading } =
        useYieldCurveMarketRatesHistorical();

    const handleCurrencyChange = useCallback(
        (v: CurrencySymbol) => {
            dispatch(setCurrency(v));
            dispatch(resetUnitPrice());
            dispatch(resetAmount());
            trackButtonEvent(
                ButtonEvents.CURRENCY_CHANGE,
                ButtonProperties.CURRENCY,
                v
            );
        },
        [dispatch]
    );

    const handleTermChange = useCallback(
        (v: Maturity) => {
            dispatch(setMaturity(Number(v)));
            dispatch(resetUnitPrice());
            trackButtonEvent(
                ButtonEvents.TERM_CHANGE,
                ButtonProperties.TERM,
                selectedTerm.label
            );
        },
        [dispatch, selectedTerm.label]
    );

    const handleAssetChange = useCallback(
        (v: CurrencySymbol) => {
            dispatch(resetAmount());
            dispatch(setCurrency(v));
        },
        [dispatch]
    );

    const handleFilterChange = useCallback(
        (state: VisibilityState) => {
            setIsShowingAll(state.showBorrow && state.showLend);
        },
        [setIsShowingAll]
    );

    const maximumOpenOrderLimit =
        fullOrderList.activeOrderList.filter(
            o => hexToCurrencySymbol(o.currency) === currency
        ).length >= 20;

    const tooltipMap: Record<number, string> = {};

    if (maximumOpenOrderLimit)
        tooltipMap[1] =
            'You have too many open orders. Please ensure that you have fewer than 20 orders to place more orders.';

    const tabTitles = isItayosePeriod
        ? isSubgraphSupported
            ? ['Open Orders', 'Order History']
            : ['Open Orders']
        : isSubgraphSupported
        ? [
              'Active Positions',
              'Open Orders',
              'Order History',
              'My Transactions',
          ]
        : ['Active Positions', 'Open Orders'];

    const preOrderDays = useMemo(() => {
        const contract = lendingContracts[selectedTerm.value.toNumber()];
        const openingDate = contract?.utcOpeningDate;
        const preOpeningDate = contract?.preOpeningDate;
        return openingDate && preOpeningDate
            ? dayjs.unix(openingDate).diff(preOpeningDate * 1000, 'days')
            : undefined;
    }, [lendingContracts, selectedTerm.value]);

    useEffect(() => {
        setIsItayose(isItayosePeriod);
        setPreOrderDays(preOrderDays);
        setMaximumOpenOrderLimit(maximumOpenOrderLimit);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isItayosePeriod, preOrderDays, maximumOpenOrderLimit]);

    return (
        <>
            <div className='grid gap-2'>
                <MovingTape nonMaturedMarketOptionList={maturitiesOptionList} />
                <ThreeColumnsWithTopBar
                    topBar={
                        <div className='relative mb-5 h-20 transition-all duration-300'>
                            {isItayosePeriod ? (
                                <Toolbar
                                    date={
                                        lendingContracts[
                                            selectedTerm.value.toNumber()
                                        ]?.utcOpeningDate
                                    }
                                    nextMarketPhase={
                                        marketPhase === MarketPhase.PRE_ORDER
                                            ? 'Pre-Open'
                                            : 'Open in'
                                    }
                                    assetList={assetList}
                                    selectedAsset={selectedAsset}
                                    options={maturitiesOptionList}
                                    selected={{
                                        label: selectedTerm.label,
                                        value: selectedTerm.value,
                                    }}
                                    currency={currency}
                                    handleAssetChange={handleAssetChange}
                                    handleTermChange={v =>
                                        dispatch(setMaturity(Number(v)))
                                    }
                                />
                            ) : (
                                <AdvancedLendingTopBar
                                    selectedAsset={selectedAsset}
                                    assetList={assetList}
                                    options={maturitiesOptionList}
                                    selected={{
                                        label: selectedTerm.label,
                                        value: selectedTerm.value,
                                    }}
                                    onAssetChange={handleCurrencyChange}
                                    onTermChange={handleTermChange}
                                    currencyPrice={currencyPrice}
                                    currentMarket={currentMarket}
                                    marketInfo={
                                        isSubgraphSupported
                                            ? dailyMarketInfo
                                            : undefined
                                    }
                                    isItayosePeriod={isItayosePeriod}
                                />
                            )}
                        </div>
                    }
                >
                    <TabSelector
                        tabDataArray={
                            isSubgraphSupported
                                ? [
                                      { text: 'Yield Curve' },
                                      {
                                          text: 'Historical Chart',
                                          disabled: isItayosePeriod,
                                      },
                                  ]
                                : [{ text: 'Yield Curve' }]
                        }
                    >
                        <div className='h-[410px] w-full px-2 py-2'>
                            <MultiLineChartTab
                                rates={rates}
                                maturityList={maturityList}
                                itayoseMarketIndexSet={itayoseMarketIndexSet}
                                followLinks={false}
                                maximumRate={maximumRate}
                                marketCloseToMaturityOriginalRate={
                                    marketCloseToMaturityOriginalRate
                                }
                                fetchedRates={historicalRates}
                                loading={ratesLoading}
                            />
                        </div>
                        {isSubgraphSupported && <HistoricalWidget />}
                    </TabSelector>

                    <>
                        <div className='col-span-1 hidden w-[calc(100%-284px)] laptop:block desktop:w-[calc(100%-312px)]'>
                            <div className='flex h-full flex-grow flex-col gap-4'>
                                <TabSelector
                                    tabDataArray={
                                        isSubgraphSupported
                                            ? [
                                                  { text: 'Yield Curve' },
                                                  {
                                                      text: 'Historical Chart',
                                                      disabled: isItayosePeriod,
                                                  },
                                              ]
                                            : [{ text: 'Yield Curve' }]
                                    }
                                    tabGroupClassName='laptop:w-full laptop:max-w-[400px] desktop:max-w-[450px]'
                                >
                                    <div className='h-[410px] w-full px-2 py-2'>
                                        <MultiLineChartTab
                                            rates={rates}
                                            maturityList={maturityList}
                                            itayoseMarketIndexSet={
                                                itayoseMarketIndexSet
                                            }
                                            followLinks={false}
                                            maximumRate={maximumRate}
                                            marketCloseToMaturityOriginalRate={
                                                marketCloseToMaturityOriginalRate
                                            }
                                            fetchedRates={historicalRates}
                                            loading={ratesLoading}
                                        />
                                    </div>
                                    {isSubgraphSupported && (
                                        <HistoricalWidget />
                                    )}
                                </TabSelector>
                            </div>
                        </div>

                        <div className='hidden laptop:block laptop:w-[272px] desktop:w-[300px]'>
                            <TabSelector
                                tabDataArray={[
                                    { text: 'Order Book' },
                                    {
                                        text: 'Recent Trades',
                                        disabled: isItayosePeriod,
                                    },
                                ]}
                            >
                                {!isTablet && (
                                    <NewOrderBookWidget
                                        orderbook={orderBook}
                                        currency={currency}
                                        marketPrice={
                                            isItayosePeriod
                                                ? estimatedOpeningUnitPrice
                                                : currentMarket?.value
                                        }
                                        maxLendUnitPrice={
                                            data?.maxLendUnitPrice
                                        }
                                        minBorrowUnitPrice={
                                            data?.minBorrowUnitPrice
                                        }
                                        onFilterChange={handleFilterChange}
                                        onAggregationChange={setMultiplier}
                                        isLoadingMap={isLoadingMap}
                                        isItayose={isItayosePeriod}
                                    />
                                )}
                                <RecentTradesTable
                                    currency={currency}
                                    maturity={maturity}
                                />
                            </TabSelector>
                        </div>
                        <div className='col-span-12 laptop:w-full'>
                            <HorizontalTabTable
                                tabTitles={tabTitles}
                                onTabChange={setSelectedTable}
                                useCustomBreakpoint={true}
                                tooltipMap={tooltipMap}
                                showAllPositions={!isItayosePeriod}
                                isChecked={isChecked}
                                setIsChecked={setIsChecked}
                            >
                                {!isItayosePeriod && (
                                    <ActiveTradeTable
                                        data={
                                            positions
                                                ? positions.map(position => {
                                                      const ccy =
                                                          hexToCurrencySymbol(
                                                              position.currency
                                                          );
                                                      if (!ccy) return position;
                                                      return {
                                                          ...position,
                                                          underMinimalCollateralThreshold:
                                                              isUnderCollateralThreshold(
                                                                  ccy,
                                                                  Number(
                                                                      position.maturity
                                                                  ),
                                                                  Number(
                                                                      position.marketPrice
                                                                  ),
                                                                  position.futureValue >
                                                                      0
                                                                      ? OrderSide.LEND
                                                                      : OrderSide.BORROW
                                                              ),
                                                      };
                                                  })
                                                : []
                                        }
                                        height={350}
                                        delistedCurrencySet={
                                            delistedCurrencySet
                                        }
                                        variant='compact'
                                    />
                                )}
                                <OrderTable
                                    data={
                                        isItayosePeriod
                                            ? filteredOrderList
                                            : orderList
                                    }
                                    height={350}
                                />
                                <OrderHistoryTable
                                    data={sortedOrderHistory}
                                    pagination={{
                                        totalData: sortedOrderHistory.length,
                                        getMoreData: () => {},
                                        containerHeight: 350,
                                    }}
                                    variant='compact'
                                    isLoading={userOrderHistory.loading}
                                />
                                {!isItayosePeriod && (
                                    <MyTransactionsTable
                                        data={myTransactions}
                                        pagination={{
                                            totalData: myTransactions.length,
                                            getMoreData: () => {},
                                            containerHeight: 350,
                                        }}
                                        variant='compact'
                                        isLoading={
                                            userTransactionHistory.loading
                                        }
                                    />
                                )}
                            </HorizontalTabTable>
                        </div>
                    </>
                    <AdvancedLendingOrderCard
                        collateralBook={collateralBook}
                        marketPrice={marketPrice}
                        delistedCurrencySet={delistedCurrencySet}
                        isItayose={isItayosePeriod}
                        calculationDate={
                            isItayosePeriod
                                ? lendingContracts[
                                      selectedTerm.value.toNumber()
                                  ]?.utcOpeningDate
                                : undefined
                        }
                        preOrderPosition={
                            filteredOrderList.length > 0
                                ? filteredOrderList[0].side === OrderSide.BORROW
                                    ? 'borrow'
                                    : 'lend'
                                : 'none'
                        }
                    />
                </ThreeColumnsWithTopBar>
            </div>
        </>
    );
};

const MovingTape = ({
    nonMaturedMarketOptionList,
}: {
    nonMaturedMarketOptionList: MaturityOptionList;
}) => {
    const router = useRouter();
    const { data: lendingMarkets = baseContracts } = useLendingMarkets();
    const { data: currencies = [] } = useCurrencies();

    const handleClick = (item: string) => {
        router.push({
            pathname: '/',
            query: {
                market: item,
            },
        });
    };

    const result = useMemo(() => {
        return currencies.flatMap(asset =>
            nonMaturedMarketOptionList.map(maturity => {
                const data = lendingMarkets[asset]?.[+maturity.value];
                const preOpeningDate = dayjs(data?.preOpeningDate * 1000);
                const now = dayjs();
                const isNotReady =
                    data?.isMatured || now.isBefore(preOpeningDate);

                const marketUnitPrice = data?.marketUnitPrice;
                const openingUnitPrice = data?.openingUnitPrice;
                const lastPrice =
                    marketUnitPrice || openingUnitPrice
                        ? LoanValue.fromPrice(
                              marketUnitPrice || openingUnitPrice,
                              +maturity.value
                          )
                        : undefined;

                return {
                    asset: `${asset}-${maturity.label}`,
                    apr: formatLoanValue(lastPrice, 'rate'),
                    isNotReady,
                };
            })
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(lendingMarkets),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(nonMaturedMarketOptionList),
    ]);

    return (
        <div className='relative ml-3 mr-3 flex items-center overflow-hidden text-neutral-50'>
            <div className='inline-block animate-scroll-left whitespace-nowrap text-xs leading-5 hover:[animation-play-state:paused]'>
                {result
                    .filter(res => !res.isNotReady)
                    .map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleClick(item.asset)}
                            aria-label={`Select ${item.asset} market. APR is ${item.apr}`}
                            className='rounded-sm px-2 py-1 hover:cursor-pointer hover:bg-white/10 hover:shadow-md'
                        >
                            {item.asset}
                            <span
                                className={`ml-1 ${
                                    Number(item.apr) < 0 ||
                                    item.apr === '--.--%'
                                        ? 'text-error-300'
                                        : 'text-success-300'
                                }`}
                            >
                                {item.apr} APR
                            </span>
                        </button>
                    ))}
            </div>
        </div>
    );
};
