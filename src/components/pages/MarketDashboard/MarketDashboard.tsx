import { MarketDashboardTable } from 'src/components/molecules';
import { ConnectWalletCard, WalletDialog } from 'src/components/organisms';
import { Page } from 'src/components/templates';
import { useWallet } from 'use-wallet';

export const MarketDashboard = () => {
    const { account } = useWallet();

    return (
        <Page title='Market Dashboard' name='exchange-page'>
            <div className='flex flex-row gap-6'>
                <div className='flex min-w-[800px] flex-grow flex-col'>
                    <MarketDashboardTable />
                </div>
                <div className='w-[350px]'>
                    {account ? null : <ConnectWalletCard />}
                </div>
                <WalletDialog />
            </div>
        </Page>
    );
};
