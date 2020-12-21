import * as constants from './constants'
import { RatesStore } from './types'

const initialStore: RatesStore = {
    borrowingRates: [],
    lendingRates: [],
    midRates: [],
    isLoading: false,
}

function ratesReducer(state = initialStore, action: any) {
    switch (action.type) {
        case constants.FETCHING_RATES:
            return {
                ...Object.freeze(state),
                isLoading: true
            }
        case constants.FETCHING_RATES_FAILURE:
            return {
                ...Object.freeze(state),
                borrowingRates: [],
                lendingRates: [],
                midRates: [],
                isLoading: false,
            }
        case constants.FETCHING_BORROW_RATES_SUCCESS:
            return {
                ...Object.freeze(state),
                lendingRates: action.data,
                isLoading: false,
            }   
        case constants.FETCHING_LEND_RATES_SUCCESS:
            return {
                ...Object.freeze(state),
                borrowingRates: action.data,
                isLoading: false,
            }   
        case constants.FETCHING_MID_RATES_SUCCESS:
            return {
                ...Object.freeze(state),
                midRates: action.data,
                isLoading: false,
            }                           
        default:
            return state               
    }
}  

export default ratesReducer