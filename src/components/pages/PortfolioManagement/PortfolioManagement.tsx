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
} from 'src/components/organisms';
import { useGraphClientHook } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { selectEthereumBalance } from 'src/store/ethereumWallet';
import { RootState } from 'src/store/types';
import {
    aggregateTrades,
    computeNetValue,
    computeWeightedAverageRate,
    CurrencySymbol,
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

    const balance = useSelector((state: RootState) =>
        selectEthereumBalance(state)
    );

    const priceMap = useSelector((state: RootState) => getPriceMap(state));

    const addressRecord = useMemo(() => {
        return {
            [WalletSource.METAMASK]: account ?? '',
        };
    }, [account]);

    const balanceRecord = useMemo(() => {
        return {
            [CurrencySymbol.ETH]: balance,
        };
    }, [balance]);

    const assetMap: AssetDisclosureProps[] = useMemo(
        () => generateWalletInformation(addressRecord, balanceRecord),
        [addressRecord, balanceRecord]
    );

    return (
        <div
            className='mx-40 mt-7 flex flex-col gap-6'
            data-cy='portfolio-management'
        >
            <div className='h-16 border-b-[0.5px] border-panelStroke font-secondary text-lg font-light leading-7 text-white'>
                Portfolio Management
            </div>
            <div className='flex flex-row justify-between gap-6 pt-4'>
                <div className='flex min-w-[800px] flex-grow flex-col gap-6'>
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
                <div className='w-[350px]'>
                    {account ? (
                        <MyWalletCard assetMap={assetMap} />
                    ) : (
                        <ConnectWalletCard />
                    )}
                </div>
            </div>
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
        </div>
    );
};
