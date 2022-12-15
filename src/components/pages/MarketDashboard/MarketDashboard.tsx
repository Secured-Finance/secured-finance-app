import { MarketDashboardTable } from 'src/components/molecules';
import { ConnectWalletCard } from 'src/components/organisms';
import { useWallet } from 'use-wallet';

export const MarketDashboard = () => {
    const { account } = useWallet();

    return (
        <div className='flex flex-col gap-9 px-40 pt-9' data-cy='exchange-page'>
            <div className='h-16 border-b-[0.5px] border-panelStroke font-secondary text-lg font-light leading-7 text-white'>
                Market Dashboard
            </div>
            <div className='flex flex-row gap-6'>
                <div className='flex min-w-[800px] flex-grow flex-col'>
                    <MarketDashboardTable />
                </div>
                <div className='w-[350px]'>
                    {account ? null : <ConnectWalletCard />}
                </div>
            </div>
        </div>
    );
};
