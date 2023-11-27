import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { useMemo } from 'react';
import {
    CollateralManagementConciseTab,
    GradientBox,
} from 'src/components/atoms';
import { DelistedCurrencyDisclaimer, StatsBar } from 'src/components/molecules';
import {
    GlobalItayoseMultiCurveChart,
    MarketLoanWidget,
    MultiCurveChart,
    MyWalletWidget,
} from 'src/components/organisms';
import { Page, TwoColumns } from 'src/components/templates';
import {
    RateType,
    baseContracts,
    emptyCollateralBook,
    emptyValueLockedBook,
    useCollateralBook,
    useCurrencyDelistedStatus,
    useGraphClientHook,
    useIsGlobalItayose,
    useLastPrices,
    useLendingMarkets,
    useLoanValues,
    useTotalNumberOfAsset,
    useValueLockedByCurrency,
} from 'src/hooks';
import {
    CurrencySymbol,
    Environment,
    PREVIOUS_TOTAL_USERS,
    Rate,
    ZERO_BI,
    computeTotalDailyVolumeInUSD,
    currencyMap,
    getCurrencyMapAsList,
    getEnvironment,
    ordinaryFormat,
    usdFormat,
} from 'src/utils';
import { useAccount } from 'wagmi';

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
    const { address, isConnected } = useAccount();
    const { data: collateralBook = emptyCollateralBook } =
        useCollateralBook(address);

    const curves: Record<string, Rate[]> = {};
    const { data: lendingContracts = baseContracts } = useLendingMarkets();

    const { data: delistedCurrencySet } = useCurrencyDelistedStatus();

    const { data: isGlobalItayose } = useIsGlobalItayose();

    getCurrencyMapAsList().forEach(ccy => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const unitPrices = useLoanValues(
            lendingContracts[ccy.symbol],
            RateType.Market,
            market => market.isReady && !market.isMatured
        );
        curves[ccy.symbol] = Array.from(unitPrices.values()).map(r => r.apr);
    });

    const { data: totalNumberOfAsset = 0 } = useTotalNumberOfAsset();
    const { data: valueLockedByCurrency = emptyValueLockedBook } =
        useValueLockedByCurrency();

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

    const { data: priceList } = useLastPrices();

    const totalVolume = useMemo(() => {
        return ordinaryFormat(
            computeTotalDailyVolumeInUSD(dailyVolumes.data ?? [], priceList)
                .totalVolumeUSD,
            0,
            2,
            'compact'
        );
    }, [priceList, dailyVolumes.data]);

    const totalValueLockedInUSD = useMemo(() => {
        let val = ZERO_BI;
        if (!valueLockedByCurrency) {
            return val;
        }
        for (const ccy of getCurrencyMapAsList()) {
            if (!valueLockedByCurrency[ccy.symbol]) continue;
            val += BigInt(
                Math.floor(
                    currencyMap[ccy.symbol].fromBaseUnit(
                        valueLockedByCurrency[ccy.symbol]
                    ) * priceList[ccy.symbol]
                )
            );
        }

        return val;
    }, [priceList, valueLockedByCurrency]);

    return (
        <Page title='Market Dashboard' name='dashboard-page'>
            <DelistedCurrencyDisclaimer currencies={delistedCurrencySet} />
            <TwoColumns>
                <div className='grid grid-cols-1 gap-y-7'>
                    <StatsBar
                        testid='market-dashboard'
                        values={[
                            {
                                name: 'Digital Assets',
                                value: totalNumberOfAsset.toString(),
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
                    {!isGlobalItayose ? (
                        <div className='w-full'>
                            <MultiCurveChart
                                title='Yield Curve'
                                curves={curves}
                                labels={Object.values(
                                    lendingContracts[CurrencySymbol.WFIL]
                                )
                                    .filter(o => o.isReady && !o.isMatured)
                                    .map(o => o.name)}
                            />
                        </div>
                    ) : (
                        <GlobalItayoseMultiCurveChart />
                    )}
                    <MarketLoanWidget isGlobalItayose={isGlobalItayose} />
                </div>
                <section className='flex flex-col gap-5'>
                    {isConnected && (
                        <GradientBox header='My Collateral'>
                            <div className='px-3 py-6'>
                                <CollateralManagementConciseTab
                                    collateralCoverage={
                                        collateralBook.coverage / 100
                                    }
                                    totalCollateralInUSD={
                                        collateralBook.usdCollateral
                                    }
                                    collateralThreshold={
                                        collateralBook.collateralThreshold
                                    }
                                    account={address}
                                />
                            </div>
                        </GradientBox>
                    )}
                    <MyWalletWidget />
                </section>
            </TwoColumns>
        </Page>
    );
};
