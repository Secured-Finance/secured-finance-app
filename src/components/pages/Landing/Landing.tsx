import { OrderSide } from '@secured-finance/sf-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { useMemo } from 'react';
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
    selectLandingOrderForm,
    setLastView,
    setOrderType,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { OrderType } from 'src/types';
import { LoanValue, Maturity } from 'src/utils/entities';
import { useWallet } from 'use-wallet';

export const emptyOptionList = [
    {
        label: '',
        value: new Maturity(0),
    },
];

export const Landing = ({ view }: { view?: ViewType }) => {
    const { account } = useWallet();
    const { currency, side, maturity, lastView } = useSelector(
        (state: RootState) => selectLandingOrderForm(state.landingOrderForm)
    );
    const lendingContracts = useSelector(
        (state: RootState) => state.availableContracts.lendingMarkets[currency],
        shallowEqual
    );
    const dispatch = useDispatch();

    const collateralBook = useCollateralBook(account);
    const maturityOptionList = useMaturityOptions(
        lendingContracts,
        market => market.isOpened
    );

    const unitPrices = useLoanValues(
        lendingContracts,
        side === OrderSide.BORROW ? RateType.Borrow : RateType.Lend,
        market => market.isOpened
    );

    const marketValue = useMemo(() => {
        if (!unitPrices) {
            return LoanValue.ZERO;
        }

        const value = unitPrices.get(maturity);
        if (!value) {
            return LoanValue.ZERO;
        }

        return value;
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
                <div className='flex flex-row items-center justify-center'>
                    <LendingCard
                        collateralBook={collateralBook}
                        marketValue={marketValue}
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
                    loanValue={marketValue}
                    rates={Array.from(unitPrices.values()).map(v => v.apr)}
                    maturitiesOptionList={maturityOptionList}
                />
            }
            initialView={view ?? lastView}
            onModeChange={v => {
                dispatch(setLastView(v));
                if (v === 'Simple') {
                    dispatch(setOrderType(OrderType.MARKET));
                } else if (v === 'Advanced') {
                    dispatch(setOrderType(OrderType.LIMIT));
                }
            }}
            pageName='lending-page'
        />
    );
};
