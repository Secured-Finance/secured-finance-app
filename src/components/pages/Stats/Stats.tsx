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
    getLoanValues,
    useCollateralBook,
    useCurrencies,
    useCurrencyDelistedStatus,
    useGraphClientHook,
    useIsGlobalItayose,
    useIsSubgraphSupported,
    useLastPrices,
    useLendingMarkets,
    useTotalValueLockedAndCurrencies,
} from 'src/hooks';
import useSF from 'src/hooks/useSecuredFinance';
import {
    CurrencySymbol,
    Environment,
    PREVIOUS_TOTAL_USERS,
    Rate,
    computeTotalProtocolVolumeInUSD,
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

export const Stats = () => {
    const { address, isConnected } = useAccount();
    const { data: collateralBook = emptyCollateralBook } =
        useCollateralBook(address);

    const totalCollateralInUSD = address ? collateralBook.usdCollateral : 0;

    const curves: Record<string, Rate[]> = {};
    const { data: lendingContracts = baseContracts } = useLendingMarkets();
    const { data: isGlobalItayose } = useIsGlobalItayose();
    const { data: currencies = [] } = useCurrencies();
    const { data: delistedCurrencySet } = useCurrencyDelistedStatus();
    const { totalValueLockedInUSD, currencies: totalValueLockedCurrencies } =
        useTotalValueLockedAndCurrencies();
    const securedFinance = useSF();
    const currentChainId = securedFinance?.config.chain.id;

    const isSubgraphSupported = useIsSubgraphSupported(currentChainId);

    currencies.forEach(ccy => {
        const unitPrices = getLoanValues(
            lendingContracts[ccy],
            RateType.Market,
            market => market.isReady && !market.isMatured
        );

        if (unitPrices.size !== 0) {
            curves[ccy] = Array.from(unitPrices.values()).map(r => r.apr);
        }
    });

    const userCountAndVolume = useGraphClientHook(
        {}, // no variables
        queries.UserCountAndVolumeDocument,
        'protocol',
        !isSubgraphSupported
    );

    const { data: priceList } = useLastPrices();

    const totalVolume = useMemo(() => {
        return usdFormat(
            computeTotalProtocolVolumeInUSD(
                userCountAndVolume.data?.volumesByCurrency ?? [],
                priceList
            ).totalVolumeUSD,
            2,
            'compact'
        );
    }, [userCountAndVolume.data?.volumesByCurrency, priceList]);

    const defaultCurrency =
        Object.keys(curves).length > 0
            ? (Object.keys(curves)[0] as CurrencySymbol)
            : CurrencySymbol.USDC;

    const currencyArray = Array.from(delistedCurrencySet);

    return (
        <Page title='Stats' name='stats-page'>
            {currencyArray.length > 0 && (
                <div className='px-3 laptop:px-0'>
                    <DelistedCurrencyDisclaimer
                        currencies={delistedCurrencySet}
                    />
                </div>
            )}
            <TwoColumns>
                <div className='grid grid-cols-1 gap-y-7'>
                    <StatsBar
                        testid='market-dashboard'
                        values={[
                            {
                                name: 'Digital Assets',
                                value: totalValueLockedCurrencies.length.toString(),
                            },
                            {
                                name: 'Total Value Locked',
                                value: usdFormat(
                                    totalValueLockedInUSD,
                                    2,
                                    'compact'
                                ),
                            },
                            ...(isSubgraphSupported
                                ? [
                                      {
                                          name: 'Total Volume',
                                          value: totalVolume,
                                      },
                                      {
                                          name: 'Total Users',
                                          value: computeTotalUsers(
                                              userCountAndVolume.data
                                                  ?.totalUsers
                                          ),
                                      },
                                  ]
                                : []),
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
                                    totalCollateralInUSD={totalCollateralInUSD}
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
