import {
    OrderHistoryDocument,
    TransactionHistoryDocument,
} from '@secured-finance/sf-graph-client/dist/graphclient/.graphclient';
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
    aggregateTrades,
    computeNetValue,
    computeWeightedAverageRate,
    percentFormat,
    usdFormat,
    WalletSource,
} from 'src/utils';
import { useWallet } from 'use-wallet';

export const PortfolioManagement = () => {
    const { account } = useWallet();
    const tradeHistory = useGraphClientHook(
        { address: account ?? '' },
        TransactionHistoryDocument,
        'transactions'
    );
    const oderHistory = useGraphClientHook(
        { address: account ?? '' },
        OrderHistoryDocument,
        'orders'
    );

    const tradeHistoryList = tradeHistory.data ?? [];
    const orderHistoryList = oderHistory.data ?? [];

    const priceMap = useSelector((state: RootState) => getPriceMap(state));

    return (
        <Page title='Portfolio Management' name='portfolio-management'>
            <TwoColumns>
                <div className='flex flex-col gap-6'>
                    <PortfolioManagementTable
                        values={[
                            usdFormat(
                                computeNetValue(tradeHistoryList, priceMap)
                            ),
                            percentFormat(
                                computeWeightedAverageRate(
                                    tradeHistoryList
                                ).toNormalizedNumber()
                            ),
                            tradeHistoryList.length.toString(),
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
                        'Active Contracts',
                        'Open Orders',
                        'My Transactions',
                    ]}
                >
                    <ActiveTradeTable
                        data={aggregateTrades(tradeHistoryList)}
                    />
                    <OrderHistoryTable data={orderHistoryList} />
                    <MyTransactionsTable data={tradeHistoryList} />
                </HorizontalTab>
            </div>
            <WalletDialog />
        </Page>
    );
};
