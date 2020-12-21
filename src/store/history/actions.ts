import * as constants from "./constants";

export function setLendingHistory(data: Array<any>) {
    return {
      type: constants.FETCHING_LENDING_HISTORY_SUCCESS,
      data
    }
}

export function startSetLendingHistory() {
    return {
        type: constants.FETCHING_HISTORY,
    }  
}

export function failSetLendingHistory() {
    return {
      type: constants.FETCHING_LENDING_HISTORY_FAILURE,
    }
}
