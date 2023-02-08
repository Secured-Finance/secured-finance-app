import {
    CollateralManagementConciseTab,
    GradientBox,
} from 'src/components/atoms';
import { MarketDashboardTable } from 'src/components/molecules';
import { ConnectWalletCard, MyWalletCard } from 'src/components/organisms';
import { Page, TwoColumns } from 'src/components/templates';
import { WalletSource } from 'src/utils';
import { useWallet } from 'use-wallet';

export const MarketDashboard = () => {
    const { account } = useWallet();
    return (
        <Page title='Market Dashboard' name='exchange-page'>
            <TwoColumns>
                <MarketDashboardTable
                    values={[
                        {
                            name: 'Digital Assets',
                            value: '4',
                            orientation: 'center',
                        },
                        {
                            name: 'Total Value Locked',
                            value: '1.2B',
                            orientation: 'center',
                        },
                        {
                            name: 'Total Volume',
                            value: '356M',
                            orientation: 'center',
                        },
                        {
                            name: 'Total Users',
                            value: '900K',
                            orientation: 'center',
                        },
                    ]}
                />
                <section className='flex flex-col gap-5'>
                    <div>
                        {account ? (
                            <MyWalletCard
                                addressRecord={{
                                    [WalletSource.METAMASK]: account ?? '',
                                }}
                            />
                        ) : (
                            <ConnectWalletCard />
                        )}
                    </div>
                    <div>
                        <GradientBox header='My Collateral'>
                            <div className='px-3 py-6'>
                                <CollateralManagementConciseTab
                                    collateralCoverage={98000}
                                    totalCollateralInUSD={123}
                                />
                            </div>
                        </GradientBox>
                    </div>
                </section>
            </TwoColumns>
        </Page>
    );
};
