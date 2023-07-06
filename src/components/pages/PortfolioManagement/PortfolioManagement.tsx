import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { useCallback, useMemo, useState } from 'react';
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
import { useWallet } from 'use-wallet';

export type Trade = TradeHistory[0];

const useFetchData = (account: string, skip: number, first: number) => {
    const userTransactionHistory = useGraphClientHook(
        { address: account?.toLowerCase() ?? '', skip: skip, first: first },
        queries.UserTransactionHistoryDocument,
        'user'
    );
    return userTransactionHistory;
};

export const PortfolioManagement = () => {
    const { account } = useWallet();
    const [skip, setSkip] = useState(0);
    const data = useFetchData(account ?? '', skip, 10);

    const userOrderHistory = useGraphClientHook(
        { address: account?.toLowerCase() ?? '', skip: 0, first: 1000 },
        queries.UserOrderHistoryDocument,
        'user'
    );

    const orderList = useOrderList(account);
    const positions = usePositions(account);

    const getTradeHistory = useCallback(
        (transactionHistory): Trade[] => {
            const tradesFromCon = formatOrders(orderList.inactiveOrderList);
            const tradeFromSub = transactionHistory?.data?.transactions ?? [];
            return [...tradeFromSub, ...tradesFromCon];
        },
        [orderList.inactiveOrderList]
    );

    const lazyOrderHistory = userOrderHistory.data?.orders ?? [];
    const sortedOrderHistory = lazyOrderHistory
        .map(order => {
            if (checkOrderIsFilled(order, orderList.inactiveOrderList)) {
                return {
                    ...order,
                    status: 'Filled' as const,
                    filledAmount: order.amount,
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

    const getMoreData = () => {
        // console.log('newData', data);
        if (skip < 30) {
            setSkip(skip + 10);
        }

        const tradeHistory = getTradeHistory(data);
        return tradeHistory;
    };

    const fetchInitialData = () => {
        return getTradeHistory(data);
    };

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
                            <MyTransactionsTable
                                data={fetchInitialData()}
                                pagination={{
                                    totalData: 40,
                                    getMoreData: getMoreData,
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
