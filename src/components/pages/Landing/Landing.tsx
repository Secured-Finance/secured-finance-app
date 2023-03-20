import { OrderSide } from '@secured-finance/sf-client';
import { useEffect, useMemo } from 'react';
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
import { getPriceMap } from 'src/store/assetPrices/selectors';
import {
    selectLandingOrderForm,
    setAvailableToBorrow,
    setLastView,
    setOrderType,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { computeAvailableToBorrow } from 'src/utils/collateral';
import { LoanValue, Maturity } from 'src/utils/entities';
import { useWallet } from 'use-wallet';

const emptyOptionList = [
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
        (state: RootState) => state.availableContracts.lendingMarkets[currency]
    );
    const dispatch = useDispatch();

    const collateralBook = useCollateralBook(account);

    const optionList = Object.entries(lendingContracts)
        .filter(o => o[1].isActive)
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

    const assetPriceMap = useSelector((state: RootState) => getPriceMap(state));

    const availableToBorrow = useMemo(() => {
        return currency && assetPriceMap
            ? computeAvailableToBorrow(
                  assetPriceMap[currency],
                  collateralBook.usdCollateral,
                  collateralBook.coverage.toNumber()
              )
            : 0;
    }, [assetPriceMap, collateralBook, currency]);

    useEffect(() => {
        dispatch(setAvailableToBorrow(availableToBorrow));
    }, [availableToBorrow, dispatch]);

    const maturityOptionList = useMemo(() => {
        return optionList.length > 0 ? optionList : emptyOptionList;
    }, [optionList]);

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
                        rates={unitPrices.map(v => v.apy)}
                        maturitiesOptionList={maturityOptionList}
                    />
                </div>
            }
            advanceComponent={
                <AdvancedLending
                    collateralBook={collateralBook}
                    loanValue={marketValue}
                    rates={unitPrices.map(v => v.apy)}
                    maturitiesOptionList={maturityOptionList}
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
