import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { HorizontalTab, StatsBar } from 'src/components/molecules';
import {
    ActiveTradeTable,
    CollateralOrganism,
    ConnectWalletCard,
    MyTransactionsTable,
    MyWalletCard,
    OrderHistoryTable,
    WalletDialog,
    OrderTable,
} from 'src/components/organisms';
import { Page, TwoColumns } from 'src/components/templates';
import { useGraphClientHook } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import {
    WalletSource,
    computeNetValue,
    usdFormat,
    formatOrders,
    checkOrderIsFilled,
    sortOrders,
} from 'src/utils';
import { useCollateralBook, useOrderList, usePositions } from 'src/hooks';
import { useWallet } from 'use-wallet';
import { TradeHistory } from 'src/types';

export type Trade = TradeHistory[0];

export const PortfolioManagement = () => {
    const { account } = useWallet();
    const userOrderHistory = useGraphClientHook(
        { address: account?.toLowerCase() ?? '', skip: 0, first: 1000 },
        queries.UserOrderHistoryDocument,
        'user'
    );
    const userTransactionHistory = useGraphClientHook(
        { address: account?.toLowerCase() ?? '', skip: 0, first: 1000 },
        queries.UserTransactionHistoryDocument,
        'user'
    );
    const orderList = useOrderList(account);
    const positions = usePositions(account);

    const tradesFromCon = formatOrders(orderList.inactiveOrderList);
    const tradeFromSub = userTransactionHistory.data?.transactions ?? [];
    const tradeHistory = [...tradeFromSub, ...tradesFromCon];

    const lazyOrderHistory = userOrderHistory.data?.orders ?? [];
    const sortedOrderHistory = lazyOrderHistory
        .map(order => {
            if (checkOrderIsFilled(order, orderList.inactiveOrderList)) {
                return {
                    ...order,
                    status: 'Filled' as const,
                    filledAmount: order.amount,
                };
            } else if (
                !order.lendingMarket.isActive &&
                (order.status === 'Open' || order.status === 'PartiallyFilled')
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
                        >
                            <ActiveTradeTable data={positions} />
                            <OrderTable data={orderList.activeOrderList} />
                            <OrderHistoryTable
                                data={sortedOrderHistory.filter(
                                    order => order.status !== 'Open'
                                )}
                            />
                            <MyTransactionsTable data={tradeHistory} />
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
