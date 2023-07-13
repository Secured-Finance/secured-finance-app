import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import {
    Order,
    LendingMarket,
} from '@secured-finance/sf-graph-client/dist/graphclients/development/.graphclient';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { HorizontalTab, StatsBar } from 'src/components/molecules';
import {
    ActiveTradeTable,
    CollateralOrganism,
    ConnectWalletCard,
    MyTransactionsTable,
    MyWalletCard,
    OrderHistoryTable,
    OrderTable,
    WalletDialog,
} from 'src/components/organisms';
import { Page, TwoColumns } from 'src/components/templates';
import {
    useCollateralBook,
    useOrderList,
    usePagination,
    usePositions,
} from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { TradeHistory } from 'src/types';
import {
    WalletSource,
    checkOrderIsFilled,
    computeNetValue,
    formatOrders,
    sortOrders,
    usdFormat,
} from 'src/utils';
import { useWallet } from 'use-wallet';

export type Trade = TradeHistory[0];

enum TableType {
    ACTIVE_POSITION = 0,
    OPEN_ORDERS,
    ORDER_HISTORY,
    MY_TRANSACTIONS,
}

export const PortfolioManagement = () => {
    const { account } = useWallet();
    const [skipTransactions, setSkipTransactions] = useState(0);
    const [skipOrders, setSkipOrders] = useState(0);
    const [selectedTable, setSelectedTable] = useState(
        TableType.ACTIVE_POSITION
    );

    const orderList = useOrderList(account);
    const positions = usePositions(account);

    const { totalData: transactionData, totalDataCount: transactionDataCount } =
        usePagination(
            account ?? '',
            skipTransactions,
            queries.UserTransactionHistoryDocument,
            selectedTable !== TableType.MY_TRANSACTIONS
        );

    const {
        totalData: orderHistoryData,
        totalDataCount: orderHistoryDataCount,
    } = usePagination(
        account ?? '',
        skipOrders,
        queries.UserOrderHistoryDocument,
        selectedTable !== TableType.ORDER_HISTORY
    );

    const sortedOrderHistory = useMemo(() => {
        const lazyOrderHistory = orderHistoryData ?? [];
        return lazyOrderHistory
            .map(
                (
                    order:
                        | (Pick<
                              Order,
                              | 'currency'
                              | 'maturity'
                              | 'side'
                              | 'amount'
                              | 'createdAt'
                              | 'orderId'
                              | 'unitPrice'
                              | 'filledAmount'
                              | 'status'
                              | 'txHash'
                          > & {
                              lendingMarket: Pick<
                                  LendingMarket,
                                  'id' | 'isActive'
                              >;
                          })
                        | (Pick<
                              Order,
                              | 'currency'
                              | 'maturity'
                              | 'side'
                              | 'amount'
                              | 'createdAt'
                              | 'orderId'
                              | 'unitPrice'
                              | 'filledAmount'
                              | 'status'
                              | 'txHash'
                          > & {
                              lendingMarket: Pick<
                                  LendingMarket,
                                  'id' | 'isActive'
                              >;
                          })
                ) => {
                    if (
                        checkOrderIsFilled(order, orderList.inactiveOrderList)
                    ) {
                        return {
                            ...order,
                            status: 'Filled' as const,
                            filledAmount: order.amount,
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
                }
            )
            .sort((a: Order, b: Order) => sortOrders(a, b));
    }, [orderHistoryData, orderList.inactiveOrderList]);

    const priceMap = useSelector((state: RootState) => getPriceMap(state));

    const collateralBook = useCollateralBook(account);

    const portfolioAnalytics = useMemo(() => {
        if (!collateralBook.fetched) {
            return {
                borrowedPV: 0,
                lentPV: 0,
                netAssetValue: 0,
            };
        }
        const borrowedPV = computeNetValue(
            positions.filter(position => position.forwardValue.isNegative()),
            priceMap
        );
        const lentPV = computeNetValue(
            positions.filter(position => !position.forwardValue.isNegative()),
            priceMap
        );
        return {
            borrowedPV,
            lentPV,
            netAssetValue: borrowedPV + lentPV + collateralBook.usdCollateral,
        };
    }, [
        collateralBook.fetched,
        collateralBook.usdCollateral,
        positions,
        priceMap,
    ]);

    const myTransactions = useMemo(() => {
        const tradesFromCon = formatOrders(orderList.inactiveOrderList);
        return [...tradesFromCon, ...transactionData];
    }, [orderList.inactiveOrderList, transactionData]);

    const myTransactionsDataCount = useMemo(
        () =>
            transactionDataCount && transactionDataCount > 0
                ? transactionDataCount + orderList.inactiveOrderList.length
                : 0,
        [orderList.inactiveOrderList.length, transactionDataCount]
    );

    return (
        <Page title='Portfolio Management' name='portfolio-management'>
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
                                value: positions.length.toString(),
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
                    <div>
                        <HorizontalTab
                            tabTitles={[
                                'Active Positions',
                                'Open Orders',
                                'Order History',
                                'My Transactions',
                            ]}
                            onTabChange={setSelectedTable}
                        >
                            <ActiveTradeTable data={positions} />
                            <OrderTable data={orderList.activeOrderList} />
                            <OrderHistoryTable
                                data={sortedOrderHistory}
                                pagination={{
                                    totalData: orderHistoryDataCount ?? 0,
                                    getMoreData: () =>
                                        setSkipOrders(skipOrders + 100),
                                }}
                            />
                            <MyTransactionsTable
                                data={myTransactions}
                                pagination={{
                                    totalData: myTransactionsDataCount,
                                    getMoreData: () =>
                                        setSkipTransactions(
                                            skipTransactions + 100
                                        ),
                                }}
                            />
                        </HorizontalTab>
                    </div>
                </div>
                <div className='my-4 laptop:my-0'>
                    {account ? (
                        <MyWalletCard
                            addressRecord={{
                                [WalletSource.METAMASK]: account,
                            }}
                        />
                    ) : (
                        <ConnectWalletCard />
                    )}
                </div>
            </TwoColumns>
            <WalletDialog />
        </Page>
    );
};
