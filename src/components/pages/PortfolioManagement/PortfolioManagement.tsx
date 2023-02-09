import { useTransactionHistory } from '@secured-finance/sf-graph-client';
import { useOrderHistory } from '@secured-finance/sf-graph-client/dist/hooks/useOrderHistory';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    AssetDisclosureProps,
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
import { selectAllBalances } from 'src/store/wallet';
import {
    aggregateTrades,
    computeNetValue,
    computeWeightedAverageRate,
    generateWalletInformation,
    percentFormat,
    usdFormat,
    WalletSource,
} from 'src/utils';
import { useWallet } from 'use-wallet';

export const PortfolioManagement = () => {
    const { account } = useWallet();
    const tradeHistory = useGraphClientHook(
        account ?? '',
        useTransactionHistory,
        'transactions'
    );
    const oderHistory = useGraphClientHook(
        account ?? '',
        useOrderHistory,
        'orders'
    );

    const balanceRecord = useSelector((state: RootState) =>
        selectAllBalances(state)
    );

    const open = useSelector(
        (state: RootState) => state.interactions.walletDialogOpen
    );
    const priceMap = useSelector((state: RootState) => getPriceMap(state));

    const addressRecord = useMemo(() => {
        return {
            [WalletSource.METAMASK]: account ?? '',
        };
    }, [account]);

    const assetMap: AssetDisclosureProps[] = useMemo(
        () => generateWalletInformation(addressRecord, balanceRecord),
        [addressRecord, balanceRecord]
    );

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
                    <MyWalletCard assetMap={assetMap} />
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
                    <ActiveTradeTable data={aggregateTrades(tradeHistory)} />
                    <OrderHistoryTable data={oderHistory} />
                    <MyTransactionsTable data={tradeHistory} />
                </HorizontalTab>
            </div>
            <WalletDialog />
        </Page>
    );
};
