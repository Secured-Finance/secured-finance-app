import { UserCountDocument } from '@secured-finance/sf-graph-client/dist/graphclient';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    CollateralManagementConciseTab,
    GradientBox,
} from 'src/components/atoms';
import { MarketDashboardTable } from 'src/components/molecules';
import { ConnectWalletCard, MyWalletCard } from 'src/components/organisms';
import { Page, TwoColumns } from 'src/components/templates';
import { useGraphClientHook, useProtocolInformation } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import {
    currencyMap,
    CurrencySymbol,
    ordinaryFormat,
    usdFormat,
    WalletSource,
} from 'src/utils';
import { useWallet } from 'use-wallet';

export const MarketDashboard = () => {
    const { account } = useWallet();

    const protocolInformation = useProtocolInformation();
    const totalUser = useGraphClientHook(
        {}, // no variables
        UserCountDocument,
        'protocol'
    );
    const priceList = useSelector((state: RootState) => getPriceMap(state));

    const totalValueLockedInUSD = useMemo(() => {
        let val = BigNumber.from(0);
        if (protocolInformation.valueLockedByCurrency) {
            for (const key of Object.keys(
                protocolInformation.valueLockedByCurrency
            )) {
                const ccy = key as CurrencySymbol;
                val = val.add(
                    Math.floor(
                        currencyMap[ccy].fromBaseUnit(
                            protocolInformation.valueLockedByCurrency[ccy]
                        ) * priceList[ccy]
                    )
                );
            }
        }
        return val;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(priceList), protocolInformation.valueLockedByCurrency]);

    return (
        <Page title='Market Dashboard' name='exchange-page'>
            <TwoColumns>
                <MarketDashboardTable
                    values={[
                        {
                            name: 'Digital Assets',
                            value: protocolInformation.totalNumberOfAsset.toString(),
                            orientation: 'center',
                        },
                        {
                            name: 'Total Value Locked',
                            value: usdFormat(
                                totalValueLockedInUSD,
                                0,
                                'compact'
                            ),
                            orientation: 'center',
                        },
                        {
                            name: 'Total Volume',
                            value: ordinaryFormat(
                                BigNumber.from(100000),
                                0,
                                'compact'
                            ),
                            orientation: 'center',
                        },
                        {
                            name: 'Total Users',
                            value: ordinaryFormat(
                                totalUser.data?.totalUsers ?? 0,
                                0,
                                'compact'
                            ),
                            orientation: 'center',
                        },
                    ]}
                />
                <section className='flex flex-col gap-5'>
                    <div>
                        {account ? (
                            <MyWalletCard
                                addressRecord={{
                                    [WalletSource.METAMASK]: account,
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
