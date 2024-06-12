import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonSizes, TextLink, Timer } from 'src/components/atoms';
import { CurrencyDropdown, StatsBar } from 'src/components/molecules';
import { GlobalItayoseMultiCurveChart } from 'src/components/organisms';
import {
    baseContracts,
    emptyValueLockedBook,
    useCollateralCurrencies,
    useCurrencies,
    useLastPrices,
    useLendingMarkets,
    useValueLockedByCurrency,
} from 'src/hooks';
import {
    resetUnitPrice,
    selectLandingOrderForm,
    setCurrency,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import {
    CurrencySymbol,
    ZERO_BI,
    currencyMap,
    toOptions,
    usdFormat,
} from 'src/utils';

export const GlobalItayose = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { data: currencies = [] } = useCurrencies();
    const { data: collateralCurrencies = [] } = useCollateralCurrencies();
    const extraCollateralCurrencies = collateralCurrencies.filter(
        element => !currencies.includes(element)
    );
    const assetList = toOptions(currencies, CurrencySymbol.USDC);

    const { currency } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const { data: lendingContracts = baseContracts } = useLendingMarkets();

    const { data: valueLockedByCurrency = emptyValueLockedBook } =
        useValueLockedByCurrency();

    const targetTime = useMemo(() => {
        let startTime = 0;
        let endTime = 0;
        for (const maturity of Object.keys(lendingContracts[currency])) {
            const contract = lendingContracts[currency][Number(maturity)];

            if (
                (contract.isItayosePeriod || contract.isPreOrderPeriod) &&
                (endTime === 0 || contract.utcOpeningDate < endTime)
            ) {
                endTime = contract.utcOpeningDate;
            }

            if (startTime === 0 || contract.preOpeningDate < startTime) {
                startTime = contract.preOpeningDate;
            }
        }

        return { start: startTime * 1000, end: endTime * 1000 };
    }, [lendingContracts, currency]);

    const { data: priceList } = useLastPrices();

    const totalValueLockedInUSD = useMemo(() => {
        let val = ZERO_BI;
        if (!valueLockedByCurrency) {
            return val;
        }

        for (const ccy of [...currencies, ...extraCollateralCurrencies] ?? []) {
            if (!valueLockedByCurrency[ccy]) continue;
            val += BigInt(
                Math.floor(
                    currencyMap[ccy].fromBaseUnit(valueLockedByCurrency[ccy]) *
                        priceList[ccy]
                )
            );
        }

        return val;
    }, [
        currencies,
        priceList,
        valueLockedByCurrency,
        extraCollateralCurrencies,
    ]);

    const handleCurrencyChange = useCallback(
        (v: CurrencySymbol) => {
            dispatch(setCurrency(v));
            dispatch(resetUnitPrice());
        },
        [dispatch]
    );

    return (
        <div className='grid grid-flow-row justify-items-center gap-y-8 text-center'>
            <section className='grid grid-flow-row justify-items-center gap-y-8 px-8 pt-12'>
                <h1 className='typography-headline-1 text-white'>
                    Pre-Open&nbsp;Market: Global&nbsp;Itayose
                </h1>
            </section>
            {dayjs().unix() > targetTime.start / 1000 ? (
                <>
                    <section className='px-8 text-white-80'>
                        <h2 className='typography-body-2 w-full text-white-80 laptop:w-[600px]'>
                            Our fixed-income markets are currently running
                            Global Itayose across all markets. Join early and
                            experience the future of decentralized finance.
                            <br />
                            Stay tuned for more updates!
                        </h2>
                    </section>
                    <section className='grid grid-flow-row justify-items-center gap-y-6 text-nebulaTeal'>
                        <Timer targetTime={targetTime.end} text='Ends in' />
                        {assetList.length > 0 && (
                            <div className='flex flex-row items-center gap-4'>
                                <CurrencyDropdown
                                    currencyOptionList={assetList}
                                    selected={assetList[0]}
                                    onChange={handleCurrencyChange}
                                    variant='fixedWidth'
                                />

                                <Button
                                    onClick={() => {
                                        router.push('/itayose/');
                                    }}
                                >
                                    GO
                                </Button>
                            </div>
                        )}
                    </section>

                    <section className='w-full max-w-[90%] laptop:w-[746px]'>
                        <GlobalItayoseMultiCurveChart />
                    </section>
                </>
            ) : (
                <>
                    <section className='px-8 text-white-80'>
                        <h2 className='typography-body-2 w-full text-white-80 laptop:w-[600px]'>
                            Our fixed-income markets are currently awaiting the
                            start of Global Itayose across all markets. You can
                            make your deposits now, even before Global Itayose
                            begins. Make your deposit and await Global Itayose
                            to begin with us!
                        </h2>
                    </section>
                    <section className='grid grid-flow-row justify-items-center gap-y-6 text-nebulaTeal'>
                        <Timer targetTime={targetTime.start} text='Starts in' />
                    </section>
                    <section className='w-full max-w-[728px] px-8'>
                        <StatsBar
                            testid='market-dashboard'
                            values={[
                                {
                                    name: 'Digital Assets',
                                    value: (
                                        currencies.length +
                                        extraCollateralCurrencies.length
                                    ).toString(),
                                },
                                {
                                    name: 'Total Value Locked',
                                    value: usdFormat(
                                        totalValueLockedInUSD,
                                        2,
                                        'compact'
                                    ),
                                },
                            ]}
                        />
                    </section>

                    <section className='px-8 text-white-80'>
                        <Button
                            size={ButtonSizes.lg}
                            onClick={() => router.push('/portfolio/')}
                        >
                            Go
                        </Button>
                    </section>
                </>
            )}

            <section className='px-8 text-center text-white-80'>
                <p>
                    Learn more about Itayose on{' '}
                    <TextLink
                        href='https://docs.secured.finance/platform-guide/unique-features/fair-price-discovery/'
                        text='Secured Finance Docs'
                    />
                </p>
            </section>
        </div>
    );
};
