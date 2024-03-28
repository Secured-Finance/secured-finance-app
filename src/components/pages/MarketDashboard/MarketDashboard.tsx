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
    getLoanValues,
    useCollateralBook,
    useCurrencies,
    useCurrencyDelistedStatus,
    useGraphClientHook,
    useIsGlobalItayose,
    useLastPrices,
    useLendingMarkets,
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
        getEnvironment().toLowerCase() === Environment.STAGING
            ? +users + PREVIOUS_TOTAL_USERS
            : +users;
    return ordinaryFormat(totalUsers ?? 0, 0, 2, 'compact');
};

export const MarketDashboard = () => {
    const { address, isConnected } = useAccount();
    const { data: collateralBook = emptyCollateralBook } =
        useCollateralBook(address);

    const curves: Record<string, Rate[]> = {};
    const { data: lendingContracts = baseContracts } = useLendingMarkets();
    const { data: isGlobalItayose } = useIsGlobalItayose();
    const { data: currencies = [] } = useCurrencies();
    const { data: delistedCurrencySet } = useCurrencyDelistedStatus();

    currencies.forEach(ccy => {
        const unitPrices = getLoanValues(
            lendingContracts[ccy],
            RateType.Market,
            market => market.isReady && !market.isMatured
        );
        curves[ccy] = Array.from(unitPrices.values()).map(r => r.apr);
    });

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
        return usdFormat(
            computeTotalDailyVolumeInUSD(dailyVolumes.data ?? [], priceList)
                .totalVolumeUSD,
            2,
            'compact'
        );
    }, [priceList, dailyVolumes.data]);

    const totalValueLockedInUSD = useMemo(() => {
        let val = ZERO_BI;
        if (!valueLockedByCurrency) {
            return val;
        }
        for (const ccy of currencies ?? []) {
            if (!valueLockedByCurrency[ccy]) continue;
            val += BigInt(
                Math.floor(
                    currencyMap[ccy].fromBaseUnit(valueLockedByCurrency[ccy]) *
                        priceList[ccy]
                )
            );
        }

        return val;
    }, [currencies, priceList, valueLockedByCurrency]);

    const defaultCurrency =
        currencies && currencies.length > 0
            ? currencies[0]
            : CurrencySymbol.WBTC;

    return (
        <Page title='Market Dashboard' name='dashboard-page'>
            <div className='px-3 tablet:px-0'>
                <DelistedCurrencyDisclaimer currencies={delistedCurrencySet} />
            </div>
            <TwoColumns>
                <div className='grid grid-cols-1 gap-y-7'>
                    <StatsBar
                        testid='market-dashboard'
                        values={[
                            {
                                name: 'Digital Assets',
                                value: currencies.length.toString(),
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
                                    lendingContracts[defaultCurrency]
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
                                    availableToBorrow={
                                        collateralBook.usdAvailableToBorrow
                                    }
                                    collateralThreshold={
                                        collateralBook.collateralThreshold
                                    }
                                    account={address}
                                />
                            </div>
                        </GradientBox>
                    )}
                    <MyWalletWidget hideBridge />
                </section>
            </TwoColumns>
        </Page>
    );
};
