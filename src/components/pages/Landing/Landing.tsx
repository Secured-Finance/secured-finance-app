import { OrderSide } from '@secured-finance/sf-client';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ViewType } from 'src/components/atoms';
import {
    AdvancedLending,
    LendingCard,
    YieldChart,
} from 'src/components/organisms';
import { SimpleAdvancedView } from 'src/components/templates';
import {
    OrderType,
    RateType,
    useCollateralBook,
    useLoanValues,
} from 'src/hooks';
import {
    selectLandingOrderForm,
    setLastView,
    setOrderType,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { LoanValue, Maturity } from 'src/utils/entities';
import { useWallet } from 'use-wallet';

export const Landing = ({ view }: { view?: ViewType }) => {
    const { account } = useWallet();
    const { currency, side, maturity, lastView } = useSelector(
        (state: RootState) => selectLandingOrderForm(state.landingOrderForm)
    );
    const lendingContracts = useSelector(
        (state: RootState) => state.availableContracts.lendingMarkets[currency]
    );
    const dispatch = useDispatch();

    const collateralBook = useCollateralBook(account);

    const optionList = Object.entries(lendingContracts).map(o => ({
        label: o[0],
        value: new Maturity(o[1]),
    }));

    const unitPrices = useLoanValues(
        currency,
        side === OrderSide.BORROW ? RateType.Borrow : RateType.Lend,
        maturity
    );

    const marketValue = useMemo(() => {
        if (!unitPrices) {
            return LoanValue.ZERO;
        }

        const value =
            unitPrices[
                Object.values(lendingContracts).indexOf(maturity.toNumber())
            ];
        if (!value) {
            return LoanValue.ZERO;
        }

        return value;
    }, [unitPrices, lendingContracts, maturity]);

    return (
        <SimpleAdvancedView
            title='OTC Lending'
            simpleComponent={
                <div className='flex flex-row items-center justify-center'>
                    <LendingCard
                        collateralBook={collateralBook}
                        marketValue={marketValue}
                        maturitiesOptionList={optionList}
                    />
                    <YieldChart
                        asset={currency}
                        isBorrow={side === OrderSide.BORROW}
                        rates={unitPrices.map(v => v.apy)}
                        maturitiesOptionList={optionList}
                    />
                </div>
            }
            advanceComponent={
                <AdvancedLending
                    collateralBook={collateralBook}
                    loanValue={marketValue}
                    rates={unitPrices.map(v => v.apy)}
                    maturitiesOptionList={optionList}
                />
            }
            initialView={view ?? lastView}
            onModeChange={v => {
                dispatch(setLastView(v));
                if (v === 'Simple') {
                    dispatch(setOrderType(OrderType.MARKET));
                }
            }}
            pageName='lending-page'
        />
    );
};
