import { useLandingOrderFormStore } from './store';
import { useMemo } from 'react';

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
            amount: state.amount !== '' ? BigInt(state.amount) : BigInt(0),
            unitPrice:
                state.unitPrice !== undefined && state.unitPrice !== ''
                    ? Number(state.unitPrice)
                    : undefined,
            amountExists: state.amount !== '',
            unitPriceExists:
                state.unitPrice !== undefined && state.unitPrice !== '',
        }),
        [
            state.currency,
            state.maturity,
            state.side,
            state.orderType,
            state.sourceAccount,
            state.isBorrowedCollateral,
            state.lastView,
            state.amount,
            state.unitPrice,
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
    amount: state.amount !== '' ? BigInt(state.amount) : BigInt(0),
    unitPrice:
        state.unitPrice !== undefined && state.unitPrice !== ''
            ? Number(state.unitPrice)
            : undefined,
    amountExists: state.amount !== '',
    unitPriceExists: state.unitPrice !== undefined && state.unitPrice !== '',
});
