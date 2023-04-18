import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { BigNumber, utils } from 'ethers';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    CollateralManagementConciseTab,
    GradientBox,
} from 'src/components/atoms';
import { MarketDashboardTable } from 'src/components/molecules';
import {
    ConnectWalletCard,
    Loan,
    MarketLoanWidget,
    MultiCurveChart,
    MyWalletCard,
} from 'src/components/organisms';
import { Page, TwoColumns } from 'src/components/templates';
import {
    RateType,
    useGraphClientHook,
    useLoanValues,
    useProtocolInformation,
} from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import {
    CurrencySymbol,
    Rate,
    WalletSource,
    computeTotalDailyVolumeInUSD,
    currencyMap,
    getCurrencyMapAsList,
    ordinaryFormat,
    toCurrencySymbol,
    usdFormat,
} from 'src/utils';
import { Maturity } from 'src/utils/entities';
import { useWallet } from 'use-wallet';

export const MarketDashboard = () => {
    const { account } = useWallet();

    const curves: Record<string, Rate[]> = {};
    const lendingContracts = useSelector(
        (state: RootState) => state.availableContracts.lendingMarkets
    );

    getCurrencyMapAsList().forEach(ccy => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        curves[ccy.symbol] = useLoanValues(
            ccy.symbol,
            RateType.MidRate,
            Object.values(lendingContracts[ccy.symbol])
                .filter(o => o.isReady)
                .map(o => new Maturity(o.maturity))
        ).map(r => r.apr);
    });

    const protocolInformation = useProtocolInformation();
    const totalUser = useGraphClientHook(
        {}, // no variables
        queries.UserCountDocument,
        'protocol',
        false
    );
    const dailyVolumes = useGraphClientHook(
        {}, // no variables
        queries.DailyVolumesDocument,
        'dailyVolumes',
        false
    );

    const priceList = useSelector((state: RootState) => getPriceMap(state));

    const totalVolume = useMemo(() => {
        return ordinaryFormat(
            computeTotalDailyVolumeInUSD(dailyVolumes.data ?? [], priceList),
            2,
            'compact'
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(priceList), dailyVolumes.data]);

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
        <Page title='Market Dashboard' name='dashboard-page'>
            <TwoColumns>
                <div className='grid grid-cols-1 gap-y-7'>
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
                                    2,
                                    'compact'
                                ),
                                orientation: 'center',
                            },
                            {
                                name: 'Total Volume',
                                value: totalVolume,
                                orientation: 'center',
                            },
                            {
                                name: 'Total Users',
                                value: ordinaryFormat(
                                    totalUser.data?.totalUsers ?? 0,
                                    2,
                                    'compact'
                                ),
                                orientation: 'center',
                            },
                        ]}
                    />
                    <div className='w-full'>
                        <MultiCurveChart
                            title='Yield Curve'
                            curves={curves}
                            labels={Object.values(
                                lendingContracts[CurrencySymbol.EFIL]
                            )
                                .filter(o => o.isActive)
                                .map(o => o.name)}
                        />
                    </div>

                    <MarketLoanWidget
                        loans={(
                            Object.keys(lendingContracts) as CurrencySymbol[]
                        ).reduce((acc, ccy) => {
                            const currency = toCurrencySymbol(ccy);
                            if (!currency) return acc;
                            const currencyContracts = Object.keys(
                                lendingContracts[currency]
                            ).map(contractName => {
                                const contract =
                                    lendingContracts[currency][contractName];
                                return {
                                    name: contract.name,
                                    maturity: contract.maturity,
                                    isActive: contract.isActive,
                                    utcOpeningDate: contract.utcOpeningDate,
                                    midUnitPrice: contract.midUnitPrice,
                                    currency: utils.formatBytes32String(ccy),
                                    isReady: contract.isReady,
                                    ccy: ccy,
                                };
                            });
                            return [...acc, ...currencyContracts];
                        }, [] as Loan[])}
                    />
                </div>
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
