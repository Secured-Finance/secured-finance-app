import { useMemo } from 'react';
import { useLandingOrderFormStore } from './store';
import type { LandingOrderFormState } from './types';

const selectValidatedAmount = (state: LandingOrderFormState) => {
    return {
        value: state.amount,
        bigIntValue:
            state.amount !== '' && !isNaN(Number(state.amount))
                ? BigInt(state.amount)
                : BigInt(0),
    };
};

const selectValidatedUnitPrice = (state: LandingOrderFormState) => {
    return {
        value: state.unitPrice,
        numberValue:
            state.unitPrice !== undefined &&
            state.unitPrice !== '' &&
            !isNaN(Number(state.unitPrice))
                ? Number(state.unitPrice)
                : undefined,
    };
};

export const useLandingOrderFormSelector = () => {
    const currency = useLandingOrderFormStore(state => state.currency);
    const maturity = useLandingOrderFormStore(state => state.maturity);
    const side = useLandingOrderFormStore(state => state.side);
    const orderType = useLandingOrderFormStore(state => state.orderType);
    const sourceAccount = useLandingOrderFormStore(
        state => state.sourceAccount
    );
    const isBorrowedCollateral = useLandingOrderFormStore(
        state => state.isBorrowedCollateral
    );
    const lastView = useLandingOrderFormStore(state => state.lastView);
    const unitPriceRaw = useLandingOrderFormStore(state => state.unitPrice);
    const amountRaw = useLandingOrderFormStore(state => state.amount);

    return useMemo(
        () => ({
            currency,
            maturity,
            side,
            orderType,
            sourceAccount,
            isBorrowedCollateral,
            lastView,
            unitPriceRaw,

            amount:
                amountRaw !== '' && !isNaN(Number(amountRaw))
                    ? BigInt(amountRaw)
                    : BigInt(0),
            unitPrice:
                unitPriceRaw !== undefined &&
                unitPriceRaw !== '' &&
                !isNaN(Number(unitPriceRaw))
                    ? Number(unitPriceRaw)
                    : undefined,

            amountExists: amountRaw !== '',
            unitPriceExists: unitPriceRaw !== undefined && unitPriceRaw !== '',
        }),
        [
            currency,
            maturity,
            side,
            orderType,
            sourceAccount,
            isBorrowedCollateral,
            lastView,
            unitPriceRaw,
            amountRaw,
        ]
    );
};

export const selectLandingOrderForm = (
    state: ReturnType<typeof useLandingOrderFormStore.getState>
) => ({
    currency: state.currency,
    maturity: state.maturity,
    side: state.side,
    orderType: state.orderType,
    sourceAccount: state.sourceAccount,
    isBorrowedCollateral: state.isBorrowedCollateral,
    lastView: state.lastView,
    amount: selectValidatedAmount(state).bigIntValue,
    unitPrice: selectValidatedUnitPrice(state).numberValue,
    amountExists: state.amount !== '',
    unitPriceExists: state.unitPrice !== undefined && state.unitPrice !== '',
});
