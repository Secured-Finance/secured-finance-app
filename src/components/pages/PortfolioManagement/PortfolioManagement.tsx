import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { useSelector } from 'react-redux';
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
} from 'src/utils';
import { useCollateralBook, useOrderList, usePositions } from 'src/hooks';
import { useWallet } from 'use-wallet';
import { TradeHistory } from 'src/types';

export type Trade = TradeHistory[0];

export const PortfolioManagement = () => {
    const { account } = useWallet();
    const userHistory = useGraphClientHook(
        { address: account?.toLowerCase() ?? '' },
        queries.UserHistoryDocument,
        'user'
    );
    const orderList = useOrderList(account);
    const positions = usePositions(account);

    const tradesFromCon = formatOrders(orderList.inactiveOrderList);
    const tradeFromSub = userHistory.data?.transactions ?? [];
    const tradeHistory = [...tradeFromSub, ...tradesFromCon];

    const lazyOrderHistory = userHistory.data?.orders ?? [];
    const orderHistory = lazyOrderHistory.map(order => {
        if (checkOrderIsFilled(order, orderList.inactiveOrderList)) {
            return {
                ...order,
                status: 'Filled' as const,
                filledAmount: order.amount,
            };
        } else {
            return order;
        }
    });

    const priceMap = useSelector((state: RootState) => getPriceMap(state));

    const borrowedPV = computeNetValue(
        positions.filter(position => position.forwardValue.isNegative()),
        priceMap
    );

    const lentPV = computeNetValue(
        positions.filter(position => !position.forwardValue.isNegative()),
        priceMap
    );

    const collateralBook = useCollateralBook(account);

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
                                    borrowedPV +
                                        lentPV +
                                        collateralBook.usdCollateral
                                ),
                            },
                            {
                                name: 'Active Contracts',
                                value: tradeHistory.length.toString(),
                            },
                            {
                                name: 'Lending PV',
                                value: usdFormat(lentPV),
                            },
                            {
                                name: 'Borrowing PV',
                                value: usdFormat(borrowedPV),
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
                                data={orderHistory.filter(
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
