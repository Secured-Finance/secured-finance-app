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
    const state = useLandingOrderFormStore();

    return useMemo(
        () => ({
            currency: state.currency,
            maturity: state.maturity,
            side: state.side,
            orderType: state.orderType,
            sourceAccount: state.sourceAccount,
            isBorrowedCollateral: state.isBorrowedCollateral,
            lastView: state.lastView,
            unitPriceRaw: state.unitPrice,

            amount: selectValidatedAmount(state).bigIntValue,
            unitPrice: selectValidatedUnitPrice(state).numberValue,

            amountExists: state.amount !== '',
            unitPriceExists:
                state.unitPrice !== undefined && state.unitPrice !== '',
        }),
        [state]
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
