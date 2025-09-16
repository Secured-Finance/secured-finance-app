import { OrderSide } from '@secured-finance/sf-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { TextLink, ViewType } from 'src/components/atoms';
import {
    Alert,
    AlertSeverity,
    DelistedCurrencyDisclaimer,
} from 'src/components/molecules';
import {
    AdvancedLending,
    LendingCard,
    YieldChart,
} from 'src/components/organisms';
import { Page } from 'src/components/templates';
import {
    LendingMarket,
    RateType,
    baseContracts,
    emptyCollateralBook,
    useBalances,
    useCollateralBook,
    useCurrencyDelistedStatus,
    useGraphClientHook,
    useIsSubgraphSupported,
    useLendingMarkets,
    useLoanValues,
    useMaturityOptions,
} from 'src/hooks';
import useSF from 'src/hooks/useSecuredFinance';
import {
    useLandingOrderFormSelector,
    useLandingOrderFormStore,
} from 'src/store/landingOrderForm';
import { OrderType } from 'src/types';
import { CurrencySymbol, MaturityConverter, ZERO_BI } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import { useAccount } from 'wagmi';

export const emptyOptionList = [
    {
        label: '',
        value: new Maturity(0),
    },
];

const ITAYOSE_PERIOD = 60 * 60 * 1000; // 1 hour in milli-seconds

export const Landing = ({ view = 'Advanced' }: { view?: ViewType }) => {
    const { setOrderType, resetUnitPrice } = useLandingOrderFormStore();
    const { address, isConnected } = useAccount();
    const balance = useBalances();
    const { data: delistedCurrencySet } = useCurrencyDelistedStatus();
    const { currency, side, maturity } = useLandingOrderFormSelector();
    const { data: lendingMarkets = baseContracts } = useLendingMarkets();
    const lendingContracts = lendingMarkets[currency];

    const { data: collateralBook = emptyCollateralBook } =
        useCollateralBook(address);

    const maturityOptionList = useMaturityOptions(
        lendingContracts,
        market => market.isOpened
    );

    const nonMaturedMarketOptionList = useMaturityOptions(
        lendingContracts,
        market => !market.isMatured
    );

    const securedFinance = useSF();
    const currentChainId = securedFinance?.config.chain.id;

    const isSubgraphSupported = useIsSubgraphSupported(currentChainId);
    const [isItayosePeriod, setIsItayosePeriod] = useState(false);

    const [maximumOpenOrderLimit, setMaximumOpenOrderLimit] =
        useState<boolean>();

    const [preOrderDays, setPreOrderDays] = useState<number | undefined>();

    const itayoseMarket = Object.entries(lendingContracts).find(
        ([, market]) => market.isPreOrderPeriod || market.isItayosePeriod
    )?.[1];

    const unitPrices = useLoanValues(
        lendingContracts,
        side === OrderSide.BORROW ? RateType.Borrow : RateType.Lend,
        market => market.isOpened
    );

    const marketPrice = useMemo(() => {
        if (unitPrices) {
            return unitPrices.get(maturity)?.price;
        }
        return undefined;
    }, [unitPrices, maturity]);

    const dailyVolumes = useGraphClientHook(
        {}, // no variables
        queries.DailyVolumesDocument,
        'dailyVolumes',
        !isSubgraphSupported
    );

    useEffect(() => {
        if (view === 'Simple') {
            setOrderType(OrderType.MARKET);
            resetUnitPrice();
        } else if (view === 'Advanced') {
            setOrderType(OrderType.LIMIT);
            resetUnitPrice();
        }
    }, [view, setOrderType, resetUnitPrice]);

    const isShowWelcomeAlert =
        Object.values(balance).every(v => v === ZERO_BI) || !isConnected;

    return (
        <Page
            name='lending-page'
            alertComponent={
                isShowWelcomeAlert && (
                    <Alert
                        title={
                            'Welcome! Please deposit funds to enable trading.'
                        }
                        severity={AlertSeverity.Basic}
                        isShowCloseButton={false}
                    />
                )
            }
        >
            <WithBanner
                ccy={currency}
                market={itayoseMarket}
                delistedCurrencySet={delistedCurrencySet}
                isItayose={isItayosePeriod}
                maximumOpenOrderLimit={maximumOpenOrderLimit}
                preOrderDays={preOrderDays}
            >
                {view === 'Simple' ? (
                    <div className='mt-6 flex flex-row items-center justify-center px-3 tablet:px-5 laptop:px-0'>
                        {/* TODO: pass not matured markets to LendingCard when simple UI redesign is ready */}
                        <LendingCard
                            collateralBook={collateralBook}
                            maturitiesOptionList={maturityOptionList}
                            marketPrice={marketPrice}
                            delistedCurrencySet={delistedCurrencySet}
                        />
                        <YieldChart
                            asset={currency}
                            dailyVolumes={
                                isSubgraphSupported
                                    ? dailyVolumes.data ?? []
                                    : undefined
                            }
                        />
                    </div>
                ) : (
                    <AdvancedLending
                        collateralBook={collateralBook}
                        maturitiesOptionList={nonMaturedMarketOptionList}
                        marketPrice={marketPrice}
                        delistedCurrencySet={delistedCurrencySet}
                        setIsItayose={setIsItayosePeriod}
                        setMaximumOpenOrderLimit={setMaximumOpenOrderLimit}
                        setPreOrderDays={setPreOrderDays}
                    />
                )}
            </WithBanner>
        </Page>
    );
};

export const WithBanner = ({
    ccy,
    market,
    delistedCurrencySet,
    children,
    isItayose,
    maximumOpenOrderLimit,
    preOrderDays,
}: {
    ccy: CurrencySymbol;
    market: LendingMarket | undefined;
    delistedCurrencySet: Set<CurrencySymbol>;
    children: React.ReactNode;
    isItayose: boolean;
    maximumOpenOrderLimit: boolean | undefined;
    preOrderDays: number | undefined;
}) => {
    const preOrderTimeLimit = market
        ? market.utcOpeningDate * 1000 - ITAYOSE_PERIOD
        : 0;

    const currencyArray = Array.from(delistedCurrencySet);

    const alertContent = (() => {
        if (maximumOpenOrderLimit) {
            return {
                severity: AlertSeverity.Warning,
                title: (
                    <>
                        You will not be able to place additional orders as you
                        currently have the maximum number of 20 orders. Please
                        wait for your order to be filled or cancel existing
                        orders before adding more.
                    </>
                ),
            };
        }

        if (isItayose && preOrderDays) {
            return {
                severity: AlertSeverity.Info,
                title: (
                    <>
                        Secure your market position by placing limit orders up
                        to {preOrderDays} days before trading begins with no
                        fees. Opt for either a lend or borrow during pre-open,
                        not both. No new pre-orders will be accepted within 1
                        hour prior to the start of trading. Learn more at{' '}
                        <TextLink
                            href='https://docs.secured.finance/platform-guide/unique-features/fair-price-discovery/'
                            text='Secured Finance Docs'
                        />
                    </>
                ),
            };
        }

        if (market && !isItayose) {
            return {
                severity: AlertSeverity.Info,
                title: (
                    <>
                        {`Market ${ccy}-${MaturityConverter.toUTCMonthYear(
                            market.maturity,
                            true
                        )} is open for pre-orders now until ${Intl.DateTimeFormat(
                            'en-US',
                            {
                                timeZone: 'UTC',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            }
                        ).format(preOrderTimeLimit)} ${Intl.DateTimeFormat(
                            'en-GB',
                            {
                                timeZone: 'UTC',
                                hour: '2-digit',
                                minute: '2-digit',
                            }
                        ).format(preOrderTimeLimit)} (UTC)`}

                        <span className='pl-4'>
                            <Link
                                href={`/?market=${ccy}-${MaturityConverter.toUTCMonthYear(
                                    market.maturity,
                                    true
                                )}`}
                                className='text-planetaryPurple underline'
                            >
                                Place Order Now
                            </Link>
                        </span>
                    </>
                ),
            };
        }

        return null;
    })();

    return (
        <div className='flex flex-col justify-center gap-3'>
            {currencyArray.length > 0 && (
                <div className='px-3 laptop:px-0'>
                    <DelistedCurrencyDisclaimer
                        currencies={delistedCurrencySet}
                    />
                </div>
            )}
            {alertContent && (
                <div className='px-3 laptop:px-0'>
                    <Alert
                        severity={alertContent.severity}
                        title={alertContent.title}
                    />
                </div>
            )}
            {children}
        </div>
    );
};
