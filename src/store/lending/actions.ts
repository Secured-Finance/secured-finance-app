import { Dispatch } from '@reduxjs/toolkit';
import * as constants from './constants';

export function updateMainCurrency(data: string) {
    return (dispatch: Dispatch) => {
        dispatch(updateSelectedCurrency(data));
        switch (data) {
            case 'FIL':
                dispatch(updateCurrencyIndex(1));
                dispatch(updateSelectedCurrencyName('Filecoin'));
                break;
            case 'ETH':
                dispatch(updateCurrencyIndex(0));
                dispatch(updateSelectedCurrencyName('Ethereum'));
                break;
            case 'USDC':
                dispatch(updateCurrencyIndex(2));
                dispatch(updateSelectedCurrencyName('USDC'));
                break;
            default:
                break;
        }
    };
}

export function updateMainCollateralCurrency(data: string) {
    return (dispatch: Dispatch) => {
        dispatch(updateCollateralCurrency(data));
    };
}

export function updateMainTerms(data: string) {
    return (dispatch: Dispatch) => {
        dispatch(updateSelectedTerms(data));
        switch (data) {
            case '3 month':
                dispatch(updateTermsIndex(0));
                break;
            case '6 month':
                dispatch(updateTermsIndex(1));
                break;
            case '1 year':
                dispatch(updateTermsIndex(2));
                break;
            case '2 year':
                dispatch(updateTermsIndex(3));
                break;
            case '3 year':
                dispatch(updateTermsIndex(4));
                break;
            case '5 year':
                dispatch(updateTermsIndex(5));
                break;
            default:
                break;
        }
    };
}

export function updateSelectedCurrency(data: string) {
    return {
        type: constants.UPDATE_SELECTED_CURRENCY,
        data,
    };
}

export function updateSelectedCurrencyName(data: string) {
    return {
        type: constants.UPDATE_SELECTED_CURRENCY_NAME,
        data,
    };
}

export function updateCurrencyIndex(data: number) {
    return {
        type: constants.UPDATE_CURRENCY_INDEX,
        data,
    };
}

export function updateCollateralCurrency(data: string) {
    return {
        type: constants.UPDATE_COLLATERAL_CURRENCY,
        data,
    };
}

export function updateCollateralCurrencyName(data: string) {
    return {
        type: constants.UPDATE_COLLATERAL_CURRENCY_NAME,
        data,
    };
}

export function updateCollateralCurrencyIndex(data: number) {
    return {
        type: constants.UPDATE_COLLATERAL_CURRENCY_INDEX,
        data,
    };
}

export function updateCollateralAmount(data: any) {
    return {
        type: constants.UPDATE_COLLATERAL_AMOUNT,
        data,
    };
}

export function updateSelectedTerms(data: string) {
    return {
        type: constants.UPDATE_SELECTED_TERMS,
        data,
    };
}

export function updateTermsIndex(data: number) {
    return {
        type: constants.UPDATE_TERMS_INDEX,
        data,
    };
}

export function updateBorrowAmount(data: any) {
    return {
        type: constants.UPDATE_BORROW_AMOUNT,
        data,
    };
}

export function updateBorrowRate(data: any) {
    return {
        type: constants.UPDATE_BORROW_RATE,
        data,
    };
}

export function updateLendAmount(data: any) {
    return {
        type: constants.UPDATE_LEND_AMOUNT,
        data,
    };
}

export function updateLendRate(data: any) {
    return {
        type: constants.UPDATE_LEND_RATE,
        data,
    };
}
