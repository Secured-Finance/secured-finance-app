import { GradientBox } from 'src/components/atoms';
import { MyWalletWidget } from 'src/components/organisms';
import { Page, TwoColumns } from 'src/components/templates';

export const EmergencyGlobalSettlement = () => {
    return (
        <Page title='Emergency Global Settlement'>
            <TwoColumns>
                <section className='typography-caption-2 grid grid-flow-row text-white'>
                    <GradientBox variant='high-contrast'>
                        <div className='flex flex-col gap-4 px-6 py-8'>
                            <p>
                                At Secured Finance, security and trust are
                                paramount. Emergency Global Settlement procedure
                                underscores our dedication to protecting your
                                assets from unforeseen challenges like
                                cyberattacks or technical anomalies. If
                                necessary, our administrators can activate this
                                procedure, pausing all market activities and
                                setting the protocol to a non-operational
                                status. Users can then redeem assets based on
                                the latest cached feeds and withdraw the
                                resulting collateral tokens. For a comprehensive
                                understanding of the Emergency Global Settlement
                                procedure, we encourage you to explore
                                Docs.Secured.Finance.
                            </p>
                            <p>
                                For a comprehensive understanding of the
                                Emergency Global Settlement procedure, we
                                encourage you to explore Docs.Secured.Finance.
                            </p>
                        </div>
                    </GradientBox>
                    <div>
                        <h2>
                            Redeem Your Active Contracts and Collateral
                            Currencies
                        </h2>
                    </div>
                </section>
                <section>
                    <GradientBox header='Protocol Collateral Snapshot'>
                        YOYOYOYO
                    </GradientBox>
                    <MyWalletWidget />
                </section>
            </TwoColumns>
        </Page>
    );
};
