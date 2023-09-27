import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Spinner } from 'src/components/atoms';
import { Alert, HorizontalTab, StatsBar } from 'src/components/molecules';
import {
    ActiveTradeTable,
    CollateralOrganism,
    ConnectWalletCard,
    MyTransactionsTable,
    MyWalletCard,
    OrderHistoryTable,
    OrderTable,
} from 'src/components/organisms';
import { Page, TwoColumns } from 'src/components/templates';
import {
    emptyCollateralBook,
    emptyOrderList,
    useCollateralBook,
    useCurrenciesForOrders,
    useGraphClientHook,
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
import { useAccount } from 'wagmi';

export type Trade = TradeHistory[0];

enum TableType {
    ACTIVE_POSITION = 0,
    OPEN_ORDERS,
    ORDER_HISTORY,
    MY_TRANSACTIONS,
}

const TabSpinner = () => (
    <div className='flex h-full w-full items-center justify-center pt-10'>
        <Spinner />
    </div>
);
const offset = 20;

export const PortfolioManagement = () => {
    const { address, isConnected } = useAccount();
    const [offsetTransactions, setOffsetTransactions] = useState(0);
    const [offsetOrders, setOffsetOrders] = useState(0);
    const [selectedTable, setSelectedTable] = useState(
        TableType.ACTIVE_POSITION
    );
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
    const { data: positions = [] } = usePositions(address, usedCurrencies);

    const paginatedTransactions = usePagination(
        userTransactionHistory.data?.transactions ?? []
    );

    const paginatedOrderHistory = usePagination(
        userOrderHistory.data?.orders ?? []
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

    const priceMap = useSelector((state: RootState) => getPriceMap(state));

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
    }, [collateralBook.usdCollateral, isLoading, positions, priceMap]);

    const myTransactions = useMemo(() => {
        const tradesFromCon = formatOrders(orderList.inactiveOrderList);
        return [...tradesFromCon, ...paginatedTransactions];
    }, [orderList.inactiveOrderList, paginatedTransactions]);

    const myTransactionsDataCount: number =
        userTransactionHistory.data?.transactionCount &&
        parseInt(userTransactionHistory.data?.transactionCount) +
            orderList.inactiveOrderList.length;

    return (
        <Page title='Portfolio Management' name='portfolio-management'>
            <Alert severity='error'>
                <p className='text-white'>
                    Please note that all contracts for WFIL will be delisted on
                    Secured Finance.{' '}
                    <a
                        className='text-secondary7'
                        href='https://docs.secured.finance/product-guide/unique-features/auto-rolling/price-discovery-for-auto-rolling'
                    >
                        Learn more
                    </a>
                </p>
            </Alert>
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
                                            setOffsetOrders(
                                                offsetOrders + offset
                                            ),
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
                                        getMoreData: () =>
                                            setOffsetTransactions(
                                                offsetTransactions + offset
                                            ),
                                        containerHeight: 300,
                                    }}
                                />
                            )}
                        </HorizontalTab>
                    </div>
                </div>
                <div className='my-4 laptop:my-0'>
                    {isConnected ? (
                        <MyWalletCard
                            addressRecord={{
                                [WalletSource.METAMASK]: address,
                            }}
                        />
                    ) : (
                        <ConnectWalletCard />
                    )}
                </div>
            </TwoColumns>
        </Page>
    );
};
