import * as constants from './constants';
import { HistoryTableData } from './types';

export function setLendingHistory(data: Array<HistoryTableData>) {
    return {
        type: constants.FETCHING_LENDING_HISTORY_SUCCESS,
        data,
    };
}

export function startSetHistory() {
    return {
        type: constants.FETCHING_HISTORY,
    };
}

export function failSetLendingHistory() {
    return {
        type: constants.FETCHING_LENDING_HISTORY_FAILURE,
    };
}

export function setBorrowingHistory(data: Array<HistoryTableData>) {
    return {
        type: constants.FETCHING_BORROWING_HISTORY_SUCCESS,
        data,
    };
}

export function failSetBorrowingHistory() {
    return {
        type: constants.FETCHING_BORROWING_HISTORY_FAILURE,
    };
}
