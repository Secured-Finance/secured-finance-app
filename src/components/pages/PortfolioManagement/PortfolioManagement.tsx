import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    AssetDisclosureProps,
    PortfolioManagementTable,
    TradeHistoryTab,
} from 'src/components/molecules';
import {
    ActiveTradeTable,
    CollateralOrganism,
    ConnectWalletCard,
    MyWalletCard,
    Position,
} from 'src/components/organisms';
import { selectEthereumBalance } from 'src/store/ethereumWallet';
import { RootState } from 'src/store/types';
import {
    CurrencySymbol,
    generateWalletInformation,
    WalletSource,
} from 'src/utils';
import { useWallet } from 'use-wallet';

export const PortfolioManagement = () => {
    const { account } = useWallet();

    const balance = useSelector((state: RootState) =>
        selectEthereumBalance(state)
    );

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

    const activeTrades = [
        {
            position: Position.Borrow,
            contract: 'FIL-DEC2022',
            apy: 0.2,
            notional: 2000,
            currency: CurrencySymbol.FIL,
            presentValue: 2000,
            dayToMaturity: 120,
            forwardValue: 150,
        },
        {
            position: Position.Lend,
            contract: 'ETH-SEP2023',
            apy: 0.1,
            notional: 1000,
            currency: CurrencySymbol.ETH,
            presentValue: 1000,
            dayToMaturity: 100,
            forwardValue: 1000,
        },
    ];

    return (
        <div
            className='mx-40 mt-7 flex flex-col gap-6'
            data-cy='portfolio-management'
        >
            <div className='typography-portfolio-heading w-fit items-center text-white'>
                Portfolio Management
            </div>
            <div className='flex flex-row justify-between gap-6 pt-4'>
                <div className='flex min-w-[800px] flex-grow flex-col gap-6'>
                    <PortfolioManagementTable />
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
                <TradeHistoryTab
                    tabTitles={['Active Contracts', 'Trade History']}
                >
                    <ActiveTradeTable data={activeTrades} />
                    <div className='px-12 text-white'>Soon</div>
                </TradeHistoryTab>
            </div>
        </div>
    );
};
