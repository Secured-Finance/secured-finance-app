import produce from 'immer';
import { isBreakStatement } from 'typescript';
import * as constants from './constants';
import { RatesStore } from './types';

const initialStore: RatesStore = {
    borrowingRates: [],
    lendingRates: [],
    midRates: [],
    isLoading: false,
};

const ratesReducer = (state = initialStore, action: any) =>
    produce(state, draft => {
        switch (action.type) {
            case constants.FETCHING_RATES:
                draft.isLoading = true;
                break;
            case constants.FETCHING_RATES_FAILURE:
                draft.borrowingRates = [];
                draft.lendingRates = [];
                draft.midRates = [];
                draft.isLoading = false;
                break;
            case constants.FETCHING_BORROW_RATES_SUCCESS:
                draft.lendingRates = action.data;
                draft.isLoading = false;
                break;
            case constants.FETCHING_LEND_RATES_SUCCESS:
                draft.borrowingRates = action.data;
                draft.isLoading = false;
                break;
            case constants.FETCHING_MID_RATES_SUCCESS:
                draft.midRates = action.data;
                draft.isLoading = false;
                break;
            default:
                break;
        }
    });

export default ratesReducer;
