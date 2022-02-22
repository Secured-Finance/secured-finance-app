import produce from 'immer';
import * as constants from './constants';
import { defaultStore, CollateralFormStore } from './types';

const initialStore: CollateralFormStore = defaultStore;

const collateralFormReducer = (state = initialStore, action: any) =>
    produce(state, draft => {
        switch (action.type) {
            case constants.FETCH_COLLATERAL_FORM_STORE:
                draft.isLoading = true;
                break;
            case constants.FETCH_COLLATERAL_FORM_STORE_FAILURE:
                draft.isLoading = false;
                break;
            case constants.UPDATE_CCY_INDEX_COLLATERAL_FORM:
                draft.isLoading = false;
                draft.currencyIndex = action.data;
                break;
            case constants.UPDATE_CCY_SHORT_NAME_COLLATERAL_FORM:
                draft.isLoading = false;
                draft.currencyShortName = action.data;
                break;
            case constants.UPDATE_CCY_NAME_COLLATERAL_FORM:
                draft.isLoading = false;
                draft.currencyName = action.data;
                break;
            case constants.UPDATE_AMOUNT_COLLATERAL_FORM:
                draft.isLoading = false;
                draft.amount = action.data;
                break;
            case constants.UPDATE_TX_FEE_COLLATERAL_FORM:
                draft.isLoading = false;
                draft.txFee = action.data;
                break;
            case constants.RESET_COLLATERAL_FORM:
                draft = defaultStore;
                break;
            default:
                break;
        }
    });

export default collateralFormReducer;
