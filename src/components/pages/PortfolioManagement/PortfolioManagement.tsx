import { OrderSide } from '@secured-finance/sf-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { useEffect, useMemo, useState } from 'react';
import { Spinner } from 'src/components/atoms';
import {
    Alert,
    DELISTED_CURRENCIES_KEY,
    HorizontalTab,
    StatsBar,
} from 'src/components/molecules';
import {
    ActiveTradeTable,
    CollateralOrganism,
    MyTransactionsTable,
    MyWalletWidget,
    OrderHistoryTable,
    OrderTable,
} from 'src/components/organisms';
import { Page, TwoColumns } from 'src/components/templates';
import {
    baseContracts,
    emptyCollateralBook,
    emptyOrderList,
    useCollateralBook,
    useCurrenciesForOrders,
    useCurrencyDelistedStatus,
    useGraphClientHook,
    useIsUnderCollateralThreshold,
    useLastPrices,
    useLendingMarkets,
    useOrderList,
    usePagination,
    usePositions,
} from 'src/hooks';
import { TradeHistory } from 'src/types';
import {
    checkOrderIsFilled,
    computeNetValue,
    formatOrders,
    hexToCurrencySymbol,
    sortOrders,
    usdFormat,
} from 'src/utils';
import { useAccount } from 'wagmi';

export type Trade = TradeHistory[0];

export enum TableType {
    ACTIVE_POSITION = 0,
    OPEN_ORDERS,
    ORDER_HISTORY,
    MY_TRANSACTIONS,
}

export const TabSpinner = () => (
    <div className='flex h-full w-full items-center justify-center pt-10'>
        <Spinner />
    </div>
);
const offset = 20;

export const PortfolioManagement = () => {
    const { address } = useAccount();
    const [offsetTransactions, setOffsetTransactions] = useState(0);
    const [offsetOrders, setOffsetOrders] = useState(0);
    const [selectedTable, setSelectedTable] = useState(
        TableType.ACTIVE_POSITION
    );
    const { data: delistedCurrencySet } = useCurrencyDelistedStatus();
    const { data: lendingMarkets = { ...baseContracts } } = useLendingMarkets();

    const userOrderHistory = useGraphClientHook(
        {
            address: address?.toLowerCase() ?? '',
            skip: offsetOrders,
            first: offset,
        },
        queries.UserOrderHistoryDocument,
        'user',
        selectedTable !== TableType.ORDER_HISTORY
    );
    const userTransactionHistory = useGraphClientHook(
        {
            address: address?.toLowerCase() ?? '',
            skip: offsetTransactions,
            first: offset,
        },
        queries.UserTransactionHistoryDocument,
        'user',
        selectedTable !== TableType.MY_TRANSACTIONS
    );
    const { data: usedCurrencies = [] } = useCurrenciesForOrders(address);
    const { data: orderList = emptyOrderList } = useOrderList(
        address,
        usedCurrencies
    );

    const activeOrderList = useMemo(() => {
        return orderList.activeOrderList.map(order => {
            const ccy = hexToCurrencySymbol(order.currency);
            if (!ccy) return order;
            const maturity = Number(order.maturity);
            const lendingMarket = lendingMarkets[ccy][maturity];
            if (
                lendingMarket?.isPreOrderPeriod ||
                lendingMarket?.isItayosePeriod
            ) {
                return {
                    ...order,
                    calculationDate: lendingMarket.utcOpeningDate,
                };
            } else {
                return order;
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(lendingMarkets),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(orderList.activeOrderList),
    ]);
    const { data: positions } = usePositions(address, usedCurrencies);

    const dataUser = useMemo(() => {
        if (selectedTable === TableType.MY_TRANSACTIONS)
            return (
                userTransactionHistory.data?.transactions[0]?.taker.id ??
                undefined
            );
        if (selectedTable === TableType.ORDER_HISTORY)
            return userOrderHistory.data?.orders[0]?.maker.id ?? undefined;
    }, [
        selectedTable,
        userOrderHistory.data?.orders,
        userTransactionHistory.data?.transactions,
    ]);

    const paginatedTransactions = usePagination(
        userTransactionHistory.data?.transactions ?? [],
        dataUser,
        address
    );

    const paginatedOrderHistory = usePagination(
        userOrderHistory.data?.orders ?? [],
        dataUser,
        address
    );

    const sortedOrderHistory = useMemo(() => {
        return paginatedOrderHistory
            .map(order => {
                if (checkOrderIsFilled(order, orderList.inactiveOrderList)) {
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
    }, [orderList.inactiveOrderList, paginatedOrderHistory]);

    const { data: priceMap } = useLastPrices();

    const { data: collateralBook = emptyCollateralBook, isLoading } =
        useCollateralBook(address);

    const portfolioAnalytics = useMemo(() => {
        if (isLoading) {
            return {
                borrowedPV: 0,
                lentPV: 0,
                netAssetValue: 0,
            };
        }
        const borrowedPV = positions
            ? computeNetValue(
                  positions.positions.filter(
                      position => position.forwardValue < 0
                  ),
                  priceMap
              )
            : 0;
        const lentPV = positions
            ? computeNetValue(
                  positions.positions.filter(
                      position => position.forwardValue > 0
                  ),
                  priceMap
              )
            : 0;
        return {
            borrowedPV,
            lentPV,
            netAssetValue: borrowedPV + lentPV + collateralBook.usdCollateral,
        };
    }, [collateralBook.usdCollateral, isLoading, positions, priceMap]);

    const myTransactions = useMemo(() => {
        const tradesFromCon = formatOrders(orderList.inactiveOrderList);
        return [...tradesFromCon, ...paginatedTransactions];
    }, [orderList.inactiveOrderList, paginatedTransactions]);

    const myTransactionsDataCount: number =
        userTransactionHistory.data?.transactionCount &&
        parseInt(userTransactionHistory.data?.transactionCount) +
            orderList.inactiveOrderList.length;

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
        });
    };

    const userDelistedCurrenciesSet = new Set<string>();

    if (positions) {
        positions.positions.forEach(position => {
            const ccy = hexToCurrencySymbol(position.currency);
            if (ccy && delistedCurrencySet.has(ccy)) {
                userDelistedCurrenciesSet.add(ccy);
            }
        });
    }

    const userDelistedCurrenciesArray = Array.from(userDelistedCurrenciesSet);
    const isUnderCollateralThreshold = useIsUnderCollateralThreshold(address);

    useEffect(() => {
        setOffsetOrders(0);
        setOffsetTransactions(0);
    }, [address]);

    return (
        <Page title='Portfolio Management' name='portfolio-management'>
            {userDelistedCurrenciesArray.length > 0 && (
                <Alert
                    severity='error'
                    showCloseButton={true}
                    localStorageKey={DELISTED_CURRENCIES_KEY}
                    localStorageValue={Array.from(delistedCurrencySet)
                        .sort()
                        .join()}
                >
                    <p className='text-white'>
                        Please note that your contracts for{' '}
                        {generateDelistedCurrencyText(
                            userDelistedCurrenciesArray
                        )}{' '}
                        will be delisted at maturity on Secured Finance.{' '}
                        <a
                            className='whitespace-nowrap text-secondary7 underline'
                            href='https://docs.secured.finance/product-guide/loan-market-platform/loan-assets/listing-and-delisting'
                            target='_blank'
                            rel='noreferrer'
                            onClick={e => {
                                e.preventDefault();
                                scrollToBottom();
                            }}
                        >
                            Learn more
                        </a>
                    </p>
                </Alert>
            )}

            <TwoColumns>
                <div className='flex flex-col gap-6'>
                    <StatsBar
                        testid='portfolio-management'
                        values={[
                            {
                                name: 'Net Asset Value',
                                value: usdFormat(
                                    portfolioAnalytics.netAssetValue
                                ),
                            },
                            {
                                name: 'Active Contracts',
                                value: positions
                                    ? positions.positions.length.toString()
                                    : '0',
                            },
                            {
                                name: 'Lending PV',
                                value: usdFormat(portfolioAnalytics.lentPV),
                            },
                            {
                                name: 'Borrowing PV',
                                value: usdFormat(portfolioAnalytics.borrowedPV),
                            },
                        ]}
                    />
                    <CollateralOrganism collateralBook={collateralBook} />
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
                                    ? positions.positions.map(position => {
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
                            delistedCurrencySet={delistedCurrencySet}
                        />
                        <OrderTable data={activeOrderList} />

                        {userOrderHistory.loading ? (
                            <TabSpinner />
                        ) : (
                            <OrderHistoryTable
                                data={sortedOrderHistory}
                                pagination={{
                                    totalData: parseInt(
                                        userOrderHistory.data?.orderCount
                                    ),
                                    getMoreData: () =>
                                        setOffsetOrders(offsetOrders + offset),
                                    containerHeight: 300,
                                }}
                            />
                        )}
                        {userTransactionHistory.loading ? (
                            <TabSpinner />
                        ) : (
                            <MyTransactionsTable
                                data={myTransactions}
                                pagination={{
                                    totalData: myTransactionsDataCount,
                                    getMoreData: () => {
                                        if (myTransactions.length >= offset) {
                                            setOffsetTransactions(
                                                offsetTransactions + offset
                                            );
                                        }
                                    },
                                    containerHeight: 300,
                                }}
                            />
                        )}
                    </HorizontalTab>
                    <Disclaimer
                        showDelistedCurrencyDisclaimer={
                            userDelistedCurrenciesArray.length > 0
                        }
                    />
                </div>
                <div className='my-4 laptop:my-0'>
                    <MyWalletWidget />
                </div>
            </TwoColumns>
        </Page>
    );
};

const Disclaimer = ({
    showDelistedCurrencyDisclaimer,
}: {
    showDelistedCurrencyDisclaimer: boolean;
}) => {
    return (
        <div className='typography-dropdown-selection-label mt-4 w-fit rounded-xl text-justify text-secondary7 '>
            {showDelistedCurrencyDisclaimer && (
                <p className='p-3'>
                    <span className='inline-flex items-baseline gap-1 text-galacticOrange'>
                        Delisting Contracts
                    </span>{' '}
                    - Auto-rolls are discontinued after the contract&apos;s
                    maturity. Borrowers are advised to repay within 7 days of
                    maturity to avoid 7% penalty. Lenders can redeem their funds
                    starting 7 days post-maturity. Note that some order books
                    might necessitate up to 2 years to reach full maturity.
                </p>
            )}

            <p className='p-3'>
                <span className='inline-flex items-baseline gap-1 text-white'>
                    Standard Contracts
                </span>{' '}
                - Secured Finance lending contract includes an auto-roll
                feature. If no action is taken by the user prior to the
                contract&apos;s maturity date, it will automatically roll over
                into the next closest expiration date. This convenience comes
                with a 0.25% fee for the auto-roll transaction.
            </p>
            <p className='p-3'>
                It is the user&apos;s responsibility to take action to unwind
                the contract prior to its maturity date. Failure to do so will
                result in the contract being automatically rolled over,
                incurring the aforementioned fee.
            </p>
            <p className='p-3'>
                For an in-depth understanding of our protocol, please refer to{' '}
                <a
                    href='https://docs.secured.finance/product-guide/loan-market-platform/loan-assets/listing-and-delisting'
                    className='whitespace-nowrap text-planetaryPurple underline'
                    target='_blank'
                    rel='noreferrer'
                >
                    Docs.Secured.Finance.
                </a>
            </p>
        </div>
    );
};

export const generateDelistedCurrencyText = (currencies: string[]) => {
    const numberOfCurrencies = currencies.length;

    if (numberOfCurrencies === 1) {
        return currencies[0];
    }

    return currencies.reduce((acc, ccy: string, index: number) => {
        if (index === numberOfCurrencies - 1) {
            return acc + `and ${ccy}`;
        } else if (index === numberOfCurrencies - 2) {
            return acc + `${ccy} `;
        } else {
            return acc + `${ccy}, `;
        }
    }, '');
};
