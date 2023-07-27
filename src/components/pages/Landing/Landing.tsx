import { OrderSide } from '@secured-finance/sf-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { ViewType } from 'src/components/atoms';
import {
    AdvancedLending,
    LendingCard,
    YieldChart,
} from 'src/components/organisms';
import { SimpleAdvancedView } from 'src/components/templates';
import {
    RateType,
    useCollateralBook,
    useGraphClientHook,
    useLoanValues,
    useMaturityOptions,
} from 'src/hooks';
import {
    resetUnitPrice,
    selectLandingOrderForm,
    setLastView,
    setMarketPrice,
    setOrderType,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { OrderType } from 'src/types';
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
    const lendingContracts = useSelector(
        (state: RootState) => state.availableContracts.lendingMarkets[currency],
        shallowEqual
    );
    const dispatch = useDispatch();

    const collateralBook = useCollateralBook(address);
    const maturityOptionList = useMaturityOptions(
        lendingContracts,
        market => market.isOpened
    );

    const unitPrices = useLoanValues(
        lendingContracts,
        side === OrderSide.BORROW ? RateType.Borrow : RateType.Lend,
        market => market.isOpened
    );

    useEffect(() => {
        if (unitPrices) {
            const value = unitPrices.get(maturity);
            if (value) {
                dispatch(setMarketPrice(value.price));
            }
        }
    }, [unitPrices, maturity, dispatch]);

    const dailyVolumes = useGraphClientHook(
        {}, // no variables
        queries.DailyVolumesDocument,
        'dailyVolumes'
    );

    return (
        <SimpleAdvancedView
            title='OTC Lending'
            simpleComponent={
                <div className='flex flex-row items-center justify-center'>
                    <LendingCard
                        collateralBook={collateralBook}
                        maturitiesOptionList={maturityOptionList}
                    />
                    <YieldChart
                        asset={currency}
                        isBorrow={side === OrderSide.BORROW}
                        rates={Array.from(unitPrices.values()).map(v => v.apr)}
                        maturitiesOptionList={maturityOptionList}
                        dailyVolumes={dailyVolumes.data ?? []}
                    />
                </div>
            }
            advanceComponent={
                <AdvancedLending
                    collateralBook={collateralBook}
                    rates={Array.from(unitPrices.values()).map(v => v.apr)}
                    maturitiesOptionList={maturityOptionList}
                />
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
