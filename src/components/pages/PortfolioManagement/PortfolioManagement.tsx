import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    AssetDisclosureProps,
    HorizontalTab,
    PortfolioManagementTable,
} from 'src/components/molecules';
import {
    ActiveTrade,
    ActiveTradeTable,
    CollateralOrganism,
    ConnectWalletCard,
    MyWalletCard,
} from 'src/components/organisms';
import { useTradeHistory } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { selectEthereumBalance, selectUSDCBalance } from 'src/store/wallet';
import {
    computeNetValue,
    computeWeightedAverageRate,
    convertTradeHistoryToTableData,
    CurrencySymbol,
    generateWalletInformation,
    percentFormat,
    usdFormat,
    WalletSource,
} from 'src/utils';
import { useWallet } from 'use-wallet';

export const PortfolioManagement = () => {
    const { account } = useWallet();
    const tradeHistory = useTradeHistory(account ?? '');

    const ethBalance = useSelector((state: RootState) =>
        selectEthereumBalance(state)
    );

    const usdcBalance = useSelector((state: RootState) =>
        selectUSDCBalance(state)
    );

    const priceMap = useSelector((state: RootState) => getPriceMap(state));

    const addressRecord = useMemo(() => {
        return {
            [WalletSource.METAMASK]: account ?? '',
        };
    }, [account]);

    const balanceRecord = useMemo(() => {
        return {
            [CurrencySymbol.ETH]: ethBalance,
            [CurrencySymbol.USDC]: usdcBalance,
        };
    }, [ethBalance, usdcBalance]);

    const assetMap: AssetDisclosureProps[] = useMemo(
        () => generateWalletInformation(addressRecord, balanceRecord),
        [addressRecord, balanceRecord]
    );

    const activeTrades: Array<ActiveTrade> = [];
    tradeHistory.forEach(trade => {
        return activeTrades.push(convertTradeHistoryToTableData(trade));
    });

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
                    tabTitles={['Active Contracts', 'Trade History']}
                >
                    <ActiveTradeTable data={activeTrades} />
                    <div className='px-12 text-white'>Soon</div>
                </HorizontalTab>
            </div>
        </div>
    );
};
