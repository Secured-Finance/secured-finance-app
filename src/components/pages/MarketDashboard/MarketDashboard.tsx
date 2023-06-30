import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { BigNumber, utils } from 'ethers';
import { useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import {
    CollateralManagementConciseTab,
    GradientBox,
} from 'src/components/atoms';
import { StatsBar } from 'src/components/molecules';
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
    useCollateralBook,
    useGraphClientHook,
    useLoanValues,
    useProtocolInformation,
} from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import {
    CurrencySymbol,
    Environment,
    PREVIOUS_TOTAL_USERS,
    Rate,
    WalletSource,
    computeTotalDailyVolumeInUSD,
    currencyMap,
    getCurrencyMapAsList,
    getEnvironment,
    ordinaryFormat,
    toCurrencySymbol,
    usdFormat,
} from 'src/utils';
import { Maturity } from 'src/utils/entities';
import { useWallet } from 'use-wallet';

const computeTotalUsers = (users: string) => {
    if (!users) {
        return '0';
    }
    const totalUsers =
        getEnvironment().toLowerCase() === Environment.DEVELOPMENT
            ? +users
            : +users + PREVIOUS_TOTAL_USERS;
    return ordinaryFormat(totalUsers ?? 0, 0, 2, 'compact');
};

export const MarketDashboard = () => {
    const { account } = useWallet();
    const collateralBook = useCollateralBook(account);

    const curves: Record<string, Rate[]> = {};
    const lendingContracts = useSelector(
        (state: RootState) => state.availableContracts.lendingMarkets,
        shallowEqual
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
        'protocol'
    );
    const dailyVolumes = useGraphClientHook(
        {}, // no variables
        queries.DailyVolumesDocument,
        'dailyVolumes'
    );

    const priceList = useSelector((state: RootState) => getPriceMap(state));

    const totalVolume = useMemo(() => {
        return ordinaryFormat(
            computeTotalDailyVolumeInUSD(dailyVolumes.data ?? [], priceList)
                .totalVolumeUSD,
            0,
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
                    <StatsBar
                        testid='market-dashboard'
                        values={[
                            {
                                name: 'Digital Assets',
                                value: protocolInformation.totalNumberOfAsset.toString(),
                            },
                            {
                                name: 'Total Value Locked',
                                value: usdFormat(
                                    totalValueLockedInUSD,
                                    2,
                                    'compact'
                                ),
                            },
                            {
                                name: 'Total Volume',
                                value: totalVolume,
                            },
                            {
                                name: 'Total Users',
                                value: computeTotalUsers(
                                    totalUser.data?.totalUsers
                                ),
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
                                    ...contract,
                                    ccy: ccy,
                                    currency: utils.formatBytes32String(ccy),
                                };
                            });
                            return [...acc, ...currencyContracts];
                        }, [] as Loan[])}
                    />
                </div>
                <section className='flex flex-col gap-5'>
                    {account && (
                        <GradientBox header='My Collateral'>
                            <div className='px-3 py-6'>
                                <CollateralManagementConciseTab
                                    collateralCoverage={
                                        collateralBook.coverage.toNumber() / 100
                                    }
                                    totalCollateralInUSD={
                                        collateralBook.usdCollateral
                                    }
                                    collateralThreshold={
                                        collateralBook.collateralThreshold
                                    }
                                />
                            </div>
                        </GradientBox>
                    )}
                    {account ? (
                        <MyWalletCard
                            addressRecord={{
                                [WalletSource.METAMASK]: account,
                            }}
                        />
                    ) : (
                        <ConnectWalletCard />
                    )}
                </section>
            </TwoColumns>
        </Page>
    );
};
