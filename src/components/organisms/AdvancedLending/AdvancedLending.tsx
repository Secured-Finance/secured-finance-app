import { OrderSide } from '@secured-finance/sf-client';
import { toBytes32 } from '@secured-finance/sf-graph-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients/';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    AdvancedLendingTopBar,
    HorizontalTab,
    Tab,
} from 'src/components/molecules';
import {
    ActiveTradeTable,
    AdvancedLendingOrderCard,
    LineChartTab,
    MyTransactionsTable,
    OrderBookWidget,
    OrderHistoryTable,
    OrderTable,
} from 'src/components/organisms';
import { TabSpinner, TableType } from 'src/components/pages';
import { ThreeColumnsWithTopBar } from 'src/components/templates';
import {
    CollateralBook,
    emptyOrderList,
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
    setAmount,
    setCurrency,
    setMaturity,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { MaturityOptionList, TransactionList } from 'src/types';
import {
    CurrencySymbol,
    ZERO_BI,
    amountFormatterFromBase,
    amountFormatterToBase,
    checkOrderIsFilled,
    currencyMap,
    formatLoanValue,
    formatOrders,
    getCurrencyMapAsOptions,
    hexToCurrencySymbol,
    ordinaryFormat,
    sortOrders,
    usdFormat,
} from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
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
    const { amount, currency, maturity } = useSelector((state: RootState) =>
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
    const assetList = useMemo(() => getCurrencyMapAsOptions(), []);

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
                } else if (
                    !order.lendingMarket.isActive &&
                    (order.status === 'Open' ||
                        order.status === 'PartiallyFilled')
                ) {
                    return {
                        ...order,
                        status: 'Expired' as const,
                    };
                } else {
                    return order;
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
                // TODO: get the time from the block
                time: 0,
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
    }, [marketUnitPrice, maturity, openingUnitPrice]);

    const selectedAsset = useMemo(() => {
        return assetList.find(option => option.value === currency);
    }, [currency, assetList]);

    const handleCurrencyChange = useCallback(
        (v: CurrencySymbol) => {
            let formatFrom = (x: bigint) => Number(x);
            if (amountFormatterFromBase && amountFormatterFromBase[currency]) {
                formatFrom = amountFormatterFromBase[currency];
            }
            let formatTo = (x: number) => BigInt(x);
            if (amountFormatterToBase && amountFormatterToBase[v]) {
                formatTo = amountFormatterToBase[v];
            }
            dispatch(setAmount(formatTo(formatFrom(amount))));
            dispatch(setCurrency(v));
            dispatch(resetUnitPrice());
        },
        [amount, currency, dispatch]
    );

    const handleTermChange = useCallback(
        (v: string) => {
            dispatch(setMaturity(Number(v)));
            dispatch(resetUnitPrice());
        },
        [dispatch]
    );

    return (
        <ThreeColumnsWithTopBar
            topBar={
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
            }
        >
            <AdvancedLendingOrderCard
                collateralBook={collateralBook}
                marketPrice={marketPrice}
                delistedCurrencySet={delistedCurrencySet}
            />

            <OrderBookWidget
                orderbook={orderBook}
                currency={currency}
                marketPrice={currentMarket?.value}
                isCurrencyDelisted={delistedCurrencySet.has(currency)}
                onFilterChange={state =>
                    setIsShowingAll(state.showBorrow && state.showLend)
                }
                onAggregationChange={setMultiplier}
            />

            <div className='flex h-full flex-grow flex-col gap-4'>
                <Tab tabDataArray={[{ text: 'Yield Curve' }]}>
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
                </Tab>
                <HorizontalTab
                    tabTitles={[
                        'Active Positions',
                        'Open Orders',
                        'Order History',
                        'My Transactions',
                    ]}
                    onTabChange={setSelectedTable}
                >
                    <ActiveTradeTable
                        data={
                            positions
                                ? positions.positions
                                      .filter(
                                          position =>
                                              position.maturity ===
                                              maturity.toString()
                                      )
                                      .map(position => {
                                          const ccy = hexToCurrencySymbol(
                                              position.currency
                                          );
                                          if (!ccy) return position;
                                          return {
                                              ...position,
                                              underMinimalCollateralThreshold:
                                                  isUnderCollateralThreshold(
                                                      ccy,
                                                      Number(position.maturity),
                                                      Number(
                                                          position.marketPrice
                                                      ),
                                                      position.forwardValue > 0
                                                          ? OrderSide.LEND
                                                          : OrderSide.BORROW
                                                  ),
                                          };
                                      })
                                : []
                        }
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
        </ThreeColumnsWithTopBar>
    );
};
