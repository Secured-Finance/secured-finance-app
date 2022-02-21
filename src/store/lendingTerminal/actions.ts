import * as constants from './constants';

export function startSetLendingTerminal() {
    return {
        type: constants.FETCHING_LENDING_TERMINAL,
    };
}

export function failSetLendingTerminal() {
    return {
        type: constants.FETCHING_LENDING_TERMINAL_FAILURE,
    };
}

export function startSetOrderbook() {
    return {
        type: constants.FETCHING_ORDERBOOK,
    };
}

export function failSetOrderbook() {
    return {
        type: constants.FETCHING_ORDERBOOK_FAILURE,
    };
}

export function startSetTradingHistory() {
    return {
        type: constants.FETCHING_TRADING_HISTORY,
    };
}

export function failSetTradingHistory() {
    return {
        type: constants.FETCHING_TRADING_HISTORY_FAILURE,
    };
}

export function setBorrowOrderbook(data: Array<any>) {
    return {
        type: constants.FETCHING_BORROW_ORDERBOOK_SUCCESS,
        data,
    };
}

export function setLendOrderbook(data: Array<any>) {
    return {
        type: constants.FETCHING_LEND_ORDERBOOK_SUCCESS,
        data,
    };
}

export function setTradingHistory(data: Array<any>) {
    return {
        type: constants.FETCHING_TRADING_HISTORY_SUCCESS,
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

export function updateMarketAddr(data: string) {
    return {
        type: constants.UPDATE_MARKET_ADDRESS,
        data,
    };
}

export function updateSpread(data: number) {
    return {
        type: constants.UPDATE_ORDERBOOK_SPREAD,
        data,
    };
}

export function updateMarketRate(data: number) {
    return {
        type: constants.UPDATE_ORDERBOOK_MARKET_RATE,
        data,
    };
}

export function updateLendingCurrency(data: string) {
    return (dispatch: any) => {
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

export function updateLendingTerms(data: string) {
    return (dispatch: any) => {
        dispatch(updateSelectedTerms(data));
        switch (data) {
            case '3mo':
                dispatch(updateTermsIndex(0));
                break;
            case '6mo':
                dispatch(updateTermsIndex(1));
                break;
            case '1yr':
                dispatch(updateTermsIndex(2));
                break;
            case '2yr':
                dispatch(updateTermsIndex(3));
                break;
            case '3yr':
                dispatch(updateTermsIndex(4));
                break;
            case '5yr':
                dispatch(updateTermsIndex(5));
                break;
            default:
                break;
        }
    };
}
