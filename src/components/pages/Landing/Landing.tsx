import { OrderSide } from '@secured-finance/sf-client';
import { getUTCMonthYear } from '@secured-finance/sf-core';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import Link from 'next/link';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ViewType } from 'src/components/atoms';
import { Alert } from 'src/components/molecules';
import {
    AdvancedLending,
    LendingCard,
    YieldChart,
} from 'src/components/organisms';
import { SimpleAdvancedView } from 'src/components/templates';
import {
    LendingMarket,
    RateType,
    baseContracts,
    emptyCollateralBook,
    useCollateralBook,
    useGraphClientHook,
    useLendingMarkets,
    useLoanValues,
    useMaturityOptions,
} from 'src/hooks';
import {
    resetUnitPrice,
    selectLandingOrderForm,
    setLastView,
    setOrderType,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { OrderType } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import { useAccount } from 'wagmi';

export const emptyOptionList = [
    {
        label: '',
        value: new Maturity(0),
    },
];

export const Landing = ({ view }: { view?: ViewType }) => {
    const { address } = useAccount();
    const { currency, side, maturity, lastView } = useSelector(
        (state: RootState) => selectLandingOrderForm(state.landingOrderForm)
    );
    const { data: lendingMarkets = baseContracts } = useLendingMarkets();
    const lendingContracts = lendingMarkets[currency];
    const dispatch = useDispatch();

    const { data: collateralBook = emptyCollateralBook } =
        useCollateralBook(address);

    const maturityOptionList = useMaturityOptions(
        lendingContracts,
        market => market.isOpened
    );

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
        'dailyVolumes'
    );

    return (
        <SimpleAdvancedView
            title='OTC Lending'
            simpleComponent={
                <WithBanner ccy={currency} market={itayoseMarket}>
                    <div className='flex flex-row items-center justify-center'>
                        <LendingCard
                            collateralBook={collateralBook}
                            maturitiesOptionList={maturityOptionList}
                            marketPrice={marketPrice}
                        />
                        <YieldChart
                            asset={currency}
                            isBorrow={side === OrderSide.BORROW}
                            rates={Array.from(unitPrices.values()).map(
                                v => v.apr
                            )}
                            maturitiesOptionList={maturityOptionList}
                            dailyVolumes={dailyVolumes.data ?? []}
                        />
                    </div>
                </WithBanner>
            }
            advanceComponent={
                <WithBanner ccy={currency} market={itayoseMarket}>
                    <AdvancedLending
                        collateralBook={collateralBook}
                        rates={Array.from(unitPrices.values()).map(v => v.apr)}
                        maturitiesOptionList={maturityOptionList}
                        marketPrice={marketPrice}
                    />
                </WithBanner>
            }
            initialView={view ?? lastView}
            onModeChange={v => {
                dispatch(setLastView(v));
                if (v === 'Simple') {
                    dispatch(setOrderType(OrderType.MARKET));
                    dispatch(resetUnitPrice());
                } else if (v === 'Advanced') {
                    dispatch(setOrderType(OrderType.LIMIT));
                    dispatch(resetUnitPrice());
                }
            }}
            pageName='lending-page'
        />
    );
};

const WithBanner = ({
    ccy,
    market,
    children,
}: {
    ccy: CurrencySymbol;
    market: LendingMarket | undefined;
    children: React.ReactNode;
}) => {
    return (
        <div className='flex flex-col justify-center gap-5'>
            {market && (
                <Alert severity='info'>
                    <div className='typography-caption flex flex-row gap-3 text-white'>
                        <p>
                            {`Itayose market for ${ccy}-${getUTCMonthYear(
                                market.maturity
                            )} is now open until ${Intl.DateTimeFormat(
                                'en-US',
                                {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }
                            ).format(market.utcOpeningDate * 1000)}`}
                        </p>
                        <Link href='itayose' passHref>
                            <a
                                href='_'
                                className='text-planetaryPurple underline'
                            >
                                Place Order Now
                            </a>
                        </Link>
                    </div>
                </Alert>
            )}
            {children}
        </div>
    );
};
