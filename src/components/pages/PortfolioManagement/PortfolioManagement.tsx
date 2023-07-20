import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Spinner } from 'src/components/atoms';
import { HorizontalTab, StatsBar } from 'src/components/molecules';
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
    useCollateralBook,
    useGraphClientHook,
    useOrderList,
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

export const PortfolioManagement = () => {
    const { address, isConnected } = useAccount();
    const [selectedTable, setSelectedTable] = useState(
        TableType.ACTIVE_POSITION
    );
    const userOrderHistory = useGraphClientHook(
        { address: address?.toLowerCase() ?? '', skip: 0, first: 1000 },
        queries.UserOrderHistoryDocument,
        'user',
        selectedTable !== TableType.ORDER_HISTORY
    );
    const userTransactionHistory = useGraphClientHook(
        { address: address?.toLowerCase() ?? '', skip: 0, first: 1000 },
        queries.UserTransactionHistoryDocument,
        'user',
        selectedTable !== TableType.MY_TRANSACTIONS
    );
    const orderList = useOrderList(address);
    const positions = usePositions(address);

    const tradesFromCon = formatOrders(orderList.inactiveOrderList);
    const tradeFromSub = userTransactionHistory.data?.transactions ?? [];
    const tradeHistory = [...tradeFromSub, ...tradesFromCon];

    const sortedOrderHistory = useMemo(() => {
        const lazyOrderHistory = userOrderHistory.data?.orders ?? [];
        return lazyOrderHistory
            .map(order => {
                if (checkOrderIsFilled(order, orderList.inactiveOrderList)) {
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
            })
            .sort((a, b) => sortOrders(a, b));
    }, [orderList.inactiveOrderList, userOrderHistory.data?.orders]);

    const priceMap = useSelector((state: RootState) => getPriceMap(state));

    const collateralBook = useCollateralBook(address);

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
                            {userOrderHistory.loading ? (
                                <TabSpinner />
                            ) : (
                                <OrderHistoryTable
                                    data={sortedOrderHistory.filter(
                                        order => order.status !== 'Open'
                                    )}
                                />
                            )}
                            {userTransactionHistory.loading ? (
                                <TabSpinner />
                            ) : (
                                <MyTransactionsTable data={tradeHistory} />
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
