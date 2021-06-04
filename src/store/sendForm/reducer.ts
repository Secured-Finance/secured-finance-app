import produce from 'immer';
import * as constants from './constants';
import { defaultStore, SendFormStore } from './types';

const initialStore: SendFormStore = defaultStore;

const sendFormReducer = (state = initialStore, action: any) =>
    produce(state, draft => {
        switch (action.type) {
            case constants.FETCH_SEND_STORE:
                draft.isLoading = true;
                break;
            case constants.FETCH_SEND_STORE_FAILURE:
                draft.isLoading = false;
                break;
            case constants.UPDATE_CCY_INDEX:
                draft.isLoading = false;
                draft.currencyIndex = action.data;
                break;
            case constants.UPDATE_CCY_SHORT_NAME:
                draft.isLoading = false;
                draft.currencyShortName = action.data;
                break;
            case constants.UPDATE_CCY_NAME:
                draft.isLoading = false;
                draft.currencyName = action.data;
                break;
            case constants.UPDATE_AMOUNT:
                draft.isLoading = false;
                draft.amount = action.data;
                break;
            case constants.UPDATE_GAS_PRICE:
                draft.isLoading = false;
                draft.gasPrice = action.data;
                break;
            case constants.UPDATE_TX_FEE:
                draft.isLoading = false;
                draft.txFee = action.data;
                break;
            case constants.UPDATE_TO_ADDRESS:
                draft.isLoading = false;
                draft.toAddress = action.data;
                break;
            case constants.RESET_SEND_FORM:
                draft = defaultStore;
                break;
            case constants.SET_MAX_TX_FEE:
                draft.maxTxFee = action.data;
                break;
            default:
                break;
        }
    });

export default sendFormReducer;
