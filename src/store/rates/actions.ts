import * as constants from './constants';

export function setBorrowingRates(rates: Array<number>) {
    return {
        type: constants.FETCHING_BORROW_RATES_SUCCESS,
        rates,
    };
}

export function setLendingRates(rates: Array<number>) {
    return {
        type: constants.FETCHING_LEND_RATES_SUCCESS,
        rates,
    };
}

export function setMidRates(rates: Array<number>) {
    return {
        type: constants.FETCHING_MID_RATES_SUCCESS,
        rates,
    };
}

export function startSetRates() {
    return {
        type: constants.FETCHING_RATES,
    };
}

export function setRatesFail() {
    return {
        type: constants.FETCHING_RATES_FAILURE,
    };
}
