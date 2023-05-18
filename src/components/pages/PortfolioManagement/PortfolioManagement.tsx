import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { useSelector } from 'react-redux';
import {
    HorizontalTab,
    PortfolioManagementTable,
} from 'src/components/molecules';
import {
    ActiveTradeTable,
    CollateralOrganism,
    ConnectWalletCard,
    MyTransactionsTable,
    MyWalletCard,
    OrderHistoryTable,
    WalletDialog,
    OpenOrderTable,
} from 'src/components/organisms';
import { Page, TwoColumns } from 'src/components/templates';
import { useGraphClientHook } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import {
    WalletSource,
    aggregateTrades,
    computeNetValue,
    computeWeightedAverageRate,
    percentFormat,
    usdFormat,
} from 'src/utils';
import { useWallet } from 'use-wallet';
import { useOrderList } from 'src/hooks/useOrderList';
import { TradeHistory } from 'src/types';
import { OrderList } from 'src/hooks/useOrderList';
import { BigNumber } from 'ethers';

export type Trade = TradeHistory[0];

function calculateForwardValue(
    amount: BigNumber,
    unitPrice: BigNumber
): BigNumber {
    return amount.mul(100).div(unitPrice);
}

const formatOrders = (orders: OrderList): TradeHistory => {
    return orders?.map(order => ({
        amount: order.amount,
        side: order.side,
        orderPrice: order.unitPrice,
        createdAt: order.timestamp,
        currency: order.currency,
        maturity: order.maturity,
        forwardValue: calculateForwardValue(order.amount, order.unitPrice),
        averagePrice: '0.00',
    }));
};

export const PortfolioManagement = () => {
    const { account } = useWallet();
    const userHistory = useGraphClientHook(
        { address: account?.toLowerCase() ?? '' },
        queries.UserHistoryDocument,
        'user'
    );
    const orderList = useOrderList(account);

    const tradesFromCon = formatOrders(orderList.inactiveOrderList);
    const tradeFromSub = userHistory.data?.transactions ?? [];
    const tradeHistory = [...tradeFromSub, ...tradesFromCon];

    const orderHistory = userHistory.data?.orders ?? [];

    const priceMap = useSelector((state: RootState) => getPriceMap(state));

    return (
        <Page title='Portfolio Management' name='portfolio-management'>
            <TwoColumns>
                <div className='flex flex-col gap-6'>
                    <PortfolioManagementTable
                        values={[
                            usdFormat(computeNetValue(tradeHistory, priceMap)),
                            percentFormat(
                                computeWeightedAverageRate(
                                    tradeHistory
                                ).toNormalizedNumber()
                            ),
                            tradeHistory.length.toString(),
                            '0',
                        ]}
                    />
                    <CollateralOrganism />
                </div>
                {account ? (
                    <MyWalletCard
                        addressRecord={{
                            [WalletSource.METAMASK]: account,
                        }}
                    />
                ) : (
                    <ConnectWalletCard />
                )}
            </TwoColumns>
            <div>
                <HorizontalTab
                    tabTitles={[
                        'Active Positions',
                        'Open Orders',
                        'My Transactions',
                    ]}
                >
                    <ActiveTradeTable data={aggregateTrades(tradeHistory)} />
                    <OpenOrderTable data={orderList.activeOrderList} />
                    <OrderHistoryTable data={orderHistory} />
                    <MyTransactionsTable data={tradeHistory} />
                </HorizontalTab>
            </div>
            <WalletDialog />
        </Page>
    );
};
