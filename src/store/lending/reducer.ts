import * as constants from './constants'
import { LendingStore } from './types'

const initialStore: LendingStore = {
    selectedCcy: "FIL",
    selectedCcyName: "Filecoin",
    currencyIndex: 1,
    collateralCcy: "ETH",
    collateralCcyName: "Ethereum",
    collateralCcyIndex: 0,
    selectedTerms: '3mo',
    termsIndex: 0,
    borrowAmount: 0,
    lendAmount: 0,
    collateralAmount: 0,
    borrowRate: 0,
    lendRate: 0,
    isLoading: false,
}

function ratesReducer(state = initialStore, action: any) {
    switch (action.type) {
        case constants.UPDATE_SELECTED_CURRENCY:
            return {
                ...Object.freeze(state),
                selectedCcy: action.data
            }
        case constants.UPDATE_SELECTED_CURRENCY_NAME:
            return {
                ...Object.freeze(state),
                selectedCcyName: action.data
            }    
        case constants.UPDATE_CURRENCY_INDEX:
            return {
                ...Object.freeze(state),
                currencyIndex: action.data
            }
        case constants.UPDATE_COLLATERAL_CURRENCY:
            return {
                ...Object.freeze(state),
                collateralCcy: action.data
            }
        case constants.UPDATE_COLLATERAL_CURRENCY_NAME:
            return {
                ...Object.freeze(state),
                collateralCcyName: action.data
            }
        case constants.UPDATE_COLLATERAL_CURRENCY_INDEX:
            return {
                ...Object.freeze(state),
                collateralCcyIndex: action.data
            }    
        case constants.UPDATE_COLLATERAL_AMOUNT:
            return {
                ...Object.freeze(state),
                collateralAmount: action.data
            }
        case constants.UPDATE_SELECTED_TERMS:
            return {
                ...Object.freeze(state),
                selectedTerms: action.data
            }
        case constants.UPDATE_TERMS_INDEX:
            return {
                ...Object.freeze(state),
                termsIndex: action.data
            }    
        case constants.UPDATE_BORROW_AMOUNT:
            return {
                ...Object.freeze(state),
                borrowAmount: action.data
            }    
        case constants.UPDATE_BORROW_RATE:
            return {
                ...Object.freeze(state),
                borrowRate: action.data
            }
        case constants.UPDATE_LEND_AMOUNT:
            return {
                ...Object.freeze(state),
                lendAmount: action.data
            }    
        case constants.UPDATE_LEND_RATE:
            return {
                ...Object.freeze(state),
                lendRate: action.data
            }    
        default:
            return state               
    }
}  

export default ratesReducer