import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    CollateralManagementConciseTab,
    GradientBox,
} from 'src/components/atoms';
import { StatsBar } from 'src/components/molecules';
import {
    ConnectWalletCard,
    MarketLoanWidget,
    MultiCurveChart,
    MyWalletCard,
} from 'src/components/organisms';
import { Page, TwoColumns } from 'src/components/templates';
import {
    RateType,
    baseContracts,
    emptyCollateralBook,
    emptyValueLockedBook,
    useCollateralBook,
    useGraphClientHook,
    useLendingMarkets,
    useLoanValues,
    useTotalNumberOfAsset,
    useValueLockedByCurrency,
    defaultDelistedStatusMap,
    useCurrencyDelistedStatus,
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
    usdFormat,
} from 'src/utils';
import { useAccount } from 'wagmi';
import { GeneralDelistedAlert } from '../Landing';

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

    const { data: currencyDelistedStatusMap = defaultDelistedStatusMap } =
        useCurrencyDelistedStatus();

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
        if (!valueLockedByCurrency) {
            return val;
        }
        for (const ccy of getCurrencyMapAsList()) {
            val = val.add(
                Math.floor(
                    currencyMap[ccy.symbol].fromBaseUnit(
                        valueLockedByCurrency[ccy.symbol]
                    ) * priceList[ccy.symbol]
                )
            );
        }

        return val;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(priceList), valueLockedByCurrency]);

    const delistedCurrencies = Object.keys(currencyDelistedStatusMap).filter(
        ccy => currencyDelistedStatusMap[ccy as CurrencySymbol]
    );

    return (
        <Page title='Market Dashboard' name='dashboard-page'>
            <GeneralDelistedAlert currencies={delistedCurrencies} />
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

                    <MarketLoanWidget />
                </div>
                <section className='flex flex-col gap-5'>
                    {isConnected && (
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
                    {isConnected ? (
                        <MyWalletCard
                            addressRecord={{
                                [WalletSource.METAMASK]: address,
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
