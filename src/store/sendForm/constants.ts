export const FETCH_SEND_STORE = 'FETCH_SEND_STORE';
export const FETCH_SEND_STORE_FAILURE = 'FETCH_SEND_STORE_FAILURE';

export const UPDATE_CCY_INDEX = 'UPDATE_CCY_INDEX';
export const UPDATE_CCY_NAME = 'UPDATE_CCY_NAME';
export const UPDATE_CCY_SHORT_NAME = 'UPDATE_CCY_SHORT_NAME';
export const UPDATE_AMOUNT = 'UPDATE_AMOUNT';
export const UPDATE_GAS_PRICE = 'UPDATE_GAS_PRICE';
export const UPDATE_TX_FEE = 'UPDATE_TX_FEE';
export const UPDATE_TO_ADDRESS = 'UPDATE_TO_ADDRESS';

export const RESET_SEND_FORM = 'RESET_SEND_FORM';

export const SET_MAX_TX_FEE = 'SET_MAX_TX_FEE';

export type SendFormActionTypes =
    | typeof FETCH_SEND_STORE
    | typeof FETCH_SEND_STORE_FAILURE
    | typeof UPDATE_CCY_INDEX
    | typeof UPDATE_CCY_NAME
    | typeof UPDATE_CCY_SHORT_NAME
    | typeof UPDATE_AMOUNT
    | typeof UPDATE_GAS_PRICE
    | typeof UPDATE_TX_FEE
    | typeof UPDATE_TO_ADDRESS
    | typeof RESET_SEND_FORM
    | typeof SET_MAX_TX_FEE;
