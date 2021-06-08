import produce from 'immer';
import * as constants from './constants';
import { defaultStore, SendFormStore } from './types';

const initialStore: SendFormStore = defaultStore;

const sendFormReducer = (state: SendFormStore = initialStore, action: any) => {
    switch (action.type) {
        case constants.FETCH_SEND_STORE:
            return {
                ...state,
                isLoading: true,
            };
        case constants.FETCH_SEND_STORE_FAILURE:
            return {
                ...state,
                isLoading: false,
            };

        case constants.UPDATE_CCY_INDEX:
            return {
                ...state,
                isLoading: false,
                currencyIndex: action.data,
            };
        case constants.UPDATE_CCY_SHORT_NAME:
            return {
                ...state,
                isLoading: false,
                currencyShortName: action.data,
            };
        case constants.UPDATE_CCY_NAME:
            return {
                ...state,
                isLoading: false,
                currencyName: action.data,
            };
        case constants.UPDATE_AMOUNT:
            return {
                ...state,
                isLoading: false,
                amount: action.data,
            };
        case constants.UPDATE_GAS_PRICE:
            return {
                ...state,
                isLoading: false,
                gasPrice: action.data,
            };
        case constants.UPDATE_TX_FEE:
            return {
                ...state,
                isLoading: false,
                txFee: action.data,
            };
        case constants.UPDATE_TO_ADDRESS:
            return {
                ...state,
                isLoading: false,
                toAddress: action.data,
            };
        case constants.RESET_SEND_FORM:
            return defaultStore;
        case constants.SET_MAX_TX_FEE:
            return {
                ...state,
                isLoading: false,
                maxTxFee: action.data,
            };
        default:
            return state;
    }
};

export default sendFormReducer;
