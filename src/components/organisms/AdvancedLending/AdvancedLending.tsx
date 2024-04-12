import { OrderSide } from '@secured-finance/sf-client';
import { toBytes32 } from '@secured-finance/sf-graph-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients/';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    AdvancedLendingTopBar,
    Alert,
    HorizontalTab,
    Tab,
} from 'src/components/molecules';
import {
    ActiveTradeTable,
    AdvancedLendingOrderCard,
    HistoricalWidget,
    LineChartTab,
    MyTransactionsTable,
    NewOrderBookWidget,
    OrderHistoryTable,
    OrderTable,
} from 'src/components/organisms';
import { TabSpinner, TableType } from 'src/components/pages';
import {
    CollateralBook,
    emptyOrderList,
    useBreakpoint,
    useCurrencies,
    useGraphClientHook,
    useIsUnderCollateralThreshold,
    useLastPrices,
    useMarket,
    useMarketOrderList,
    useOrderList,
    usePositions,
    useYieldCurveMarketRates,
} from 'src/hooks';
import { useOrderbook } from 'src/hooks/useOrderbook';
import {
    resetUnitPrice,
    selectLandingOrderForm,
    setCurrency,
    setMaturity,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { MaturityOptionList, TransactionList } from 'src/types';
import {
    ButtonEvents,
    ButtonProperties,
    CurrencySymbol,
    ZERO_BI,
    checkOrderIsFilled,
    currencyMap,
    formatLoanValue,
    formatOrders,
    getMappedOrderStatus,
    hexToCurrencySymbol,
    ordinaryFormat,
    sortOrders,
    toOptions,
    usdFormat,
} from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import { trackButtonEvent } from 'src/utils/events';
import { useAccount } from 'wagmi';
import { MOBILE_TAB_OPTIONS, TAB_OPTIONS } from './constants';

const useTradeHistoryDetails = (
    transactions: TransactionList,
    currency: CurrencySymbol,
    maturity: Maturity
) => {
    return useMemo(() => {
        let min = 10000;
        let max = 0;
        let sum = ZERO_BI;
        let count = 0;
        if (!transactions.length) {
            min = 0;
            max = 0;
        }
        for (const t of transactions) {
            const price = t.averagePrice * 10000;
            if (price < min) min = price;
            if (price > max) max = price;
            sum += BigInt(t.amount);
            count++;
        }

        return {
            min: LoanValue.fromPrice(min, maturity.toNumber()),
            max: LoanValue.fromPrice(max, maturity.toNumber()),
            sum: currencyMap[currency].fromBaseUnit(sum),
            count,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency, maturity.toNumber(), transactions.length]);
};

export const AdvancedLending = ({
    collateralBook,
    maturitiesOptionList,
    marketPrice,
    delistedCurrencySet,
}: {
    collateralBook: CollateralBook;
    maturitiesOptionList: MaturityOptionList;
    marketPrice: number | undefined;
    delistedCurrencySet: Set<CurrencySymbol>;
}) => {
    const isTablet = useBreakpoint('laptop');
    const isLaptop = useBreakpoint('desktop');
    const tabOptions = isLaptop ? MOBILE_TAB_OPTIONS : TAB_OPTIONS;
    const { currency, maturity } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );
    const [timestamp, setTimestamp] = useState<number>(1643713200);
    const [selectedTable, setSelectedTable] = useState(
        TableType.ACTIVE_POSITION
    );

    const dispatch = useDispatch();
    const { address } = useAccount();
    const { data: priceList } = useLastPrices();
    const { data: orderList = emptyOrderList } = useOrderList(address, [
        currency,
    ]);
    const { data: positions } = usePositions(address, [currency]);

    const currencyPrice = priceList[currency];
    const { data: currencies } = useCurrencies();
    const assetList = toOptions(currencies, currency);

    useEffect(() => {
        setTimestamp(Math.round(new Date().getTime() / 1000));
    }, []);

    const filteredInactiveOrderList = useMemo(
        () =>
            orderList.inactiveOrderList.filter(
                order => order.maturity === maturity.toString()
            ),
        [maturity, orderList.inactiveOrderList]
    );
    const isUnderCollateralThreshold = useIsUnderCollateralThreshold(address);

    const userOrderHistory = useGraphClientHook(
        {
            address: address?.toLowerCase() ?? '',
            currency: toBytes32(currency),
            maturity: maturity,
        },
        queries.FilteredUserOrderHistoryDocument,
        'user',
        selectedTable !== TableType.ORDER_HISTORY
    );

    const userTransactionHistory = useGraphClientHook(
        {
            address: address?.toLowerCase() ?? '',
            currency: toBytes32(currency),
            maturity: maturity,
        },
        queries.FilteredUserTransactionHistoryDocument,
        'user',
        selectedTable !== TableType.MY_TRANSACTIONS
    );

    const sortedOrderHistory = useMemo(() => {
        return (userOrderHistory.data?.orders || [])
            .map(order => {
                if (checkOrderIsFilled(order, filteredInactiveOrderList)) {
                    return {
                        ...order,
                        status: 'Filled' as const,
                        filledAmount: order.inputAmount,
                    };
                } else {
                    return {
                        ...order,
                        status: getMappedOrderStatus(order),
                    } as typeof order & { status: string };
                }
            })
            .sort((a, b) => sortOrders(a, b));
    }, [filteredInactiveOrderList, userOrderHistory.data?.orders]);

    const myTransactions = useMemo(() => {
        const tradesFromCon = formatOrders(filteredInactiveOrderList);
        return [
            ...tradesFromCon,
            ...(userTransactionHistory.data?.transactions || []),
        ];
    }, [filteredInactiveOrderList, userTransactionHistory.data?.transactions]);

    const selectedTerm = useMemo(() => {
        return (
            maturitiesOptionList.find(option =>
                option.value.equals(new Maturity(maturity))
            ) || maturitiesOptionList[0]
        );
    }, [maturity, maturitiesOptionList]);

    const data = useMarket(currency, maturity);
    const marketUnitPrice = data?.marketUnitPrice;
    const openingUnitPrice = data?.openingUnitPrice;

    const [orderBook, setMultiplier, setIsShowingAll] = useOrderbook(
        currency,
        maturity
    );

    const filteredOrderList = useMarketOrderList(address, currency, maturity);

    const transactionHistory = useGraphClientHook(
        {
            currency: toBytes32(currency),
            maturity: maturity,
            from: timestamp - 24 * 3600,
            to: timestamp,
        },
        queries.TransactionHistoryDocument
    ).data;

    const tradeHistoryDetails = useTradeHistoryDetails(
        transactionHistory?.transactionHistory ?? [],
        currency,
        selectedTerm.value
    );

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

    const selectedAsset = useMemo(() => {
        return assetList.find(option => option.value === currency);
    }, [currency, assetList]);

    const handleCurrencyChange = useCallback(
        (v: CurrencySymbol) => {
            dispatch(setCurrency(v));
            dispatch(resetUnitPrice());
            trackButtonEvent(
                ButtonEvents.CURRENCY_CHANGE,
                ButtonProperties.CURRENCY,
                v
            );
        },
        [dispatch]
    );

    const handleTermChange = useCallback(
        (v: string) => {
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

    const activeTradeData = positions
        ? positions.positions
              .filter(position => position.maturity === maturity.toString())
              .map(position => {
                  const ccy = hexToCurrencySymbol(position.currency);
                  if (!ccy) return position;
                  return {
                      ...position,
                      underMinimalCollateralThreshold:
                          isUnderCollateralThreshold(
                              ccy,
                              Number(position.maturity),
                              Number(position.marketPrice),
                              position.futureValue > 0
                                  ? OrderSide.LEND
                                  : OrderSide.BORROW
                          ),
                  };
              })
        : [];

    const tabData = [
        { text: 'Yield Curve' },
        {
            text: 'Historical Chart',
            suffixIcon: (
                <span className='ml-2.5 block h-[17px] rounded-[5px] border border-warning-300 bg-warning-300/10 px-1.5 text-2xs text-warning-300'>
                    New
                </span>
            ),
        },
    ];

    const maximumOpenOrderLimit = orderList.activeOrderList.length >= 20;

    const tooltipMap: Record<number, string> = {};

    if (maximumOpenOrderLimit)
        tooltipMap[1] =
            'You have too many open orders. Please ensure that you have fewer than 20 orders to place more orders.';

    return (
        <div className='grid gap-2'>
            {maximumOpenOrderLimit && (
                <div className='px-3 laptop:px-0'>
                    <Alert severity='warning'>
                        <div className='typography-caption text-neutral-50'>
                            You will not be able to place additional orders as
                            you currently have the maximum number of 20 orders.
                            Please wait for your order to be filled or cancel
                            existing orders before adding more.
                        </div>
                    </Alert>
                </div>
            )}

            <div className='grid h-fit grid-cols-1 place-items-stretch gap-x-3 tablet:grid-cols-2 laptop:grid-cols-4 laptop:gap-y-4'>
                <div className='tablet:col-span-2 laptop:col-span-4'>
                    <AdvancedLendingTopBar
                        selectedAsset={selectedAsset}
                        assetList={assetList}
                        options={maturitiesOptionList.map(o => ({
                            label: o.label,
                            value: o.value.toString(),
                        }))}
                        selected={{
                            label: selectedTerm.label,
                            value: selectedTerm.value.toString(),
                        }}
                        onAssetChange={handleCurrencyChange}
                        onTermChange={handleTermChange}
                        currentMarket={currentMarket}
                        values={[
                            formatLoanValue(tradeHistoryDetails.max, 'price'),
                            formatLoanValue(tradeHistoryDetails.min, 'price'),
                            tradeHistoryDetails.count,
                            tradeHistoryDetails.sum
                                ? ordinaryFormat(tradeHistoryDetails.sum)
                                : '-',
                            usdFormat(currencyPrice, 2),
                        ]}
                    />
                </div>
                <div className='mb-4 block tablet:col-span-2 laptop:mb-0 laptop:hidden'>
                    <Tab tabDataArray={tabData}>
                        <div className='h-[410px] w-full px-2 py-4'>
                            <LineChartTab
                                rates={rates}
                                maturityList={maturityList}
                                itayoseMarketIndexSet={itayoseMarketIndexSet}
                                followLinks={false}
                                maximumRate={maximumRate}
                                marketCloseToMaturityOriginalRate={
                                    marketCloseToMaturityOriginalRate
                                }
                            />
                        </div>
                        <HistoricalWidget />
                    </Tab>
                </div>
                <div className='tablet:col-span-2 laptop:col-span-1'>
                    <AdvancedLendingOrderCard
                        collateralBook={collateralBook}
                        marketPrice={marketPrice}
                        delistedCurrencySet={delistedCurrencySet}
                    />
                </div>
                <div className='hidden laptop:col-span-1 laptop:block'>
                    {!isTablet && (
                        <NewOrderBookWidget
                            orderbook={orderBook}
                            currency={currency}
                            marketPrice={currentMarket?.value}
                            maxLendUnitPrice={data?.maxLendUnitPrice}
                            minBorrowUnitPrice={data?.minBorrowUnitPrice}
                            onFilterChange={state =>
                                setIsShowingAll(
                                    state.showBorrow && state.showLend
                                )
                            }
                            onAggregationChange={setMultiplier}
                        />
                    )}
                </div>
                <div className='col-span-1 tablet:col-span-2'>
                    <div className='flex h-full flex-grow flex-col gap-4 px-4 laptop:px-0'>
                        <div className='hidden laptop:block'>
                            <Tab tabDataArray={tabData}>
                                <div className='h-[410px] w-full px-2 py-4'>
                                    <LineChartTab
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
                                    />
                                </div>
                                <HistoricalWidget />
                            </Tab>
                        </div>
                        <HorizontalTab
                            tabTitles={tabOptions}
                            onTabChange={setSelectedTable}
                            tooltipMap={tooltipMap}
                        >
                            <ActiveTradeTable
                                data={activeTradeData}
                                height={350}
                                delistedCurrencySet={delistedCurrencySet}
                                variant='contractOnly'
                            />
                            <OrderTable
                                data={filteredOrderList}
                                variant='compact'
                                height={350}
                            />
                            {userOrderHistory.loading ? (
                                <TabSpinner />
                            ) : (
                                <OrderHistoryTable
                                    data={sortedOrderHistory}
                                    pagination={{
                                        totalData: sortedOrderHistory.length,
                                        getMoreData: () => {},
                                        containerHeight: 350,
                                    }}
                                    variant='contractOnly'
                                />
                            )}
                            {userTransactionHistory.loading ? (
                                <TabSpinner />
                            ) : (
                                <MyTransactionsTable
                                    data={myTransactions}
                                    pagination={{
                                        totalData: myTransactions.length,
                                        getMoreData: () => {},
                                        containerHeight: 350,
                                    }}
                                    variant='contractOnly'
                                />
                            )}
                        </HorizontalTab>
                    </div>
                </div>
            </div>
        </div>
    );
};
