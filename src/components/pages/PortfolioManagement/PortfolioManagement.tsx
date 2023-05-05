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

export const PortfolioManagement = () => {
    const { account } = useWallet();
    const userHistory = useGraphClientHook(
        { address: account?.toLowerCase() ?? '' },
        queries.UserHistoryDocument,
        'user'
    );

    const tradeHistory = userHistory.data?.transactions ?? [];
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
                    <OrderHistoryTable data={orderHistory} />
                    <MyTransactionsTable data={tradeHistory} />
                </HorizontalTab>
            </div>
            <WalletDialog />
        </Page>
    );
};
