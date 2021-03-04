import * as constants from "./constants";

export function setLendingHistory(data: Array<any>) {
    return {
      type: constants.FETCHING_LENDING_HISTORY_SUCCESS,
      data
    }
}

export function startSetHistory() {
    return {
        type: constants.FETCHING_HISTORY,
    }  
}

export function failSetLendingHistory() {
    return {
      type: constants.FETCHING_LENDING_HISTORY_FAILURE,
    }
}

export function setBorrowingHistory(data: Array<any>) {
  return {
    type: constants.FETCHING_BORROWING_HISTORY_SUCCESS,
    data
  }
}

export function failSetBorrowingHistory() {
  return {
    type: constants.FETCHING_BORROWING_HISTORY_FAILURE,
  }
}