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

    const optionList = Object.entries(lendingContracts)
        .filter(o => o[1].isReady)
        .map(o => ({
            label: o[0],
            value: new Maturity(o[1].maturity),
        }));

    const unitPrices = useLoanValues(
        currency,
        side === OrderSide.BORROW ? RateType.Borrow : RateType.Lend,
        optionList.map(o => o.value)
    );

    const marketValue = useMemo(() => {
        if (!unitPrices) {
            return LoanValue.ZERO;
        }

        const value =
            unitPrices[
                Object.values(lendingContracts).findIndex(
                    v => v.maturity === maturity.toNumber()
                )
            ];
        if (!value) {
            return LoanValue.ZERO;
        }

        return value;
    }, [unitPrices, lendingContracts, maturity]);

    const maturityOptionList = useMemo(() => {
        return optionList.length > 0 ? optionList : emptyOptionList;
    }, [optionList]);

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
                        rates={unitPrices.map(v => v.apr)}
                        maturitiesOptionList={maturityOptionList}
                        dailyVolumes={dailyVolumes.data ?? []}
                    />
                </div>
            }
            advanceComponent={
                <AdvancedLending
                    collateralBook={collateralBook}
                    loanValue={marketValue}
                    rates={unitPrices.map(v => v.apr)}
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
