import produce from 'immer'
import * as constants from './constants'
import { LendingTerminalStore } from './types'

const initialStore: LendingTerminalStore = {
    market: '',
    selectedCcy: "FIL",
    selectedCcyName: "Filecoin",
    currencyIndex: 1,
    selectedTerms: '3mo',
    termsIndex: 0,
    borrowAmount: 0,
    borrowRate: 0,
    lendAmount: 0,
    lendRate: 0,
    spread: 0,
    marketRate: 0,
    lendOrderbook: [],
    borrowOrderbook: [],
    tradingHistory: [],
    isLoading: false,
}

const lendingTerminalReducer = (state = initialStore, action: any) => 
    produce(state, draft => {
    switch (action.type) {
        case constants.FETCHING_LENDING_TERMINAL:
            draft.isLoading = true
            break
        case constants.FETCHING_LENDING_TERMINAL_FAILURE:
            draft.isLoading = false
            break
        case constants.FETCHING_ORDERBOOK:
            draft.isLoading = true
            break
        case constants.FETCHING_ORDERBOOK_FAILURE:
            draft.isLoading = false
            break
        case constants.FETCHING_TRADING_HISTORY:
            draft.isLoading = true
            break
        case constants.FETCHING_TRADING_HISTORY_FAILURE:
            draft.isLoading = false
            break
        case constants.FETCHING_BORROW_ORDERBOOK_SUCCESS:
            draft.borrowOrderbook = action.data
            break
        case constants.FETCHING_LEND_ORDERBOOK_SUCCESS:
            draft.lendOrderbook = action.data
            break
        case constants.FETCHING_TRADING_HISTORY_SUCCESS:
            draft.tradingHistory = action.data
            break
        case constants.UPDATE_SELECTED_TERMS:
            draft.selectedTerms = action.data
            break
        case constants.UPDATE_TERMS_INDEX:
            draft.termsIndex = action.data
            break
        case constants.UPDATE_BORROW_AMOUNT:
            draft.borrowAmount = action.data
            break
        case constants.UPDATE_BORROW_RATE:
            draft.borrowRate = action.data
            break
        case constants.UPDATE_LEND_AMOUNT:
            draft.lendAmount = action.data
            break
        case constants.UPDATE_LEND_RATE:
            draft.lendRate = action.data
            break
        case constants.UPDATE_CURRENCY_INDEX:
            draft.currencyIndex = action.data
            break
        case constants.UPDATE_SELECTED_CURRENCY:
            draft.selectedCcy = action.data
            break
        case constants.UPDATE_SELECTED_CURRENCY_NAME:
            draft.selectedCcyName = action.data
            break
        case constants.UPDATE_MARKET_ADDRESS:
            draft.market = action.data
            break
        case constants.UPDATE_ORDERBOOK_SPREAD:
            draft.spread = action.data
            break
        case constants.UPDATE_ORDERBOOK_MARKET_RATE:
            draft.marketRate = action.data
            break           
        default:
            break               
    }
})

export default lendingTerminalReducer