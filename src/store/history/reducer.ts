import produce from 'immer';
import * as constants from './constants';
import { HistoryStore } from './types';

const initialStore: HistoryStore = {
    lendingHistory: [],
    borrowingHistory: [],
    isLoading: false,
};

const historyReducer = (state = initialStore, action: any) =>
    produce(state, draft => {
        switch (action.type) {
            case constants.FETCHING_HISTORY:
                draft.isLoading = true;
                break;
            case constants.FETCHING_LENDING_HISTORY_FAILURE:
                draft.isLoading = false;
                break;
            case constants.FETCHING_LENDING_HISTORY_SUCCESS:
                draft.lendingHistory = action.data;
                draft.isLoading = true;
                break;
            case constants.FETCHING_BORROWING_HISTORY_FAILURE:
                draft.isLoading = false;
                break;
            case constants.FETCHING_BORROWING_HISTORY_SUCCESS:
                draft.borrowingHistory = action.data;
                draft.isLoading = true;
                break;
            default:
                break;
        }
    });

export default historyReducer;
