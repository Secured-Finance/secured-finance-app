import * as constants from './constants'
import { HistoryStore } from './types'

const initialStore: HistoryStore = {
    lendingHistory: [],
    isLoading: false,
}

function ratesReducer(state = initialStore, action: any) {
    switch (action.type) {
        case constants.FETCHING_HISTORY:
            return {
                ...Object.freeze(state),
                isLoading: true
            }
        case constants.FETCHING_LENDING_HISTORY_FAILURE:
            return {
                ...Object.freeze(state),
                isLoading: false,
            }
        case constants.FETCHING_LENDING_HISTORY_SUCCESS:
            return {
                ...Object.freeze(state),
                lendingHistory: action.data,
                isLoading: false,
            }   
        default:
            return state               
    }
}  

export default ratesReducer