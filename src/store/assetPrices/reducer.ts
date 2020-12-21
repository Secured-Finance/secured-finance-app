import * as constants from './constants'
import { AssetPrices } from './types'

const initialStore: AssetPrices = {
    ethereum: {
        price: 0,
        change: 0
    },
    filecoin: {
        price: 0,
        change: 0
    },
    isLoading: false,
}

function ethAccountReducer(state = initialStore, action: any) {
    switch (action.type) {
        case constants.FETCHING_ASSET_PRICE:
            return {
                ...Object.freeze(state),
                isLoading: true
            }
        case constants.FETCHING_ASSET_PRICE_FAILURE:
            return {
                ...Object.freeze(state),
                isLoading: false
            }
        case constants.UPDATE_ETHEREUM_USD_PRICE:
            return {
                ...Object.freeze(state),
                ethereum: {
                    ...state.ethereum,
                    price: action.data,
                }
            }
        case constants.UPDATE_ETHEREUM_USD_CHANGE:
            return {
                ...Object.freeze(state),
                ethereum: {
                    ...state.ethereum,
                    change: action.data,
                }
            }
        case constants.UPDATE_FILECOIN_USD_PRICE:
            return {
                ...Object.freeze(state),
                filecoin: {
                    ...state.filecoin,
                    price: action.data,
                }
            }
        case constants.UPDATE_FILECOIN_USD_CHANGE:
            return {
                ...Object.freeze(state),
                filecoin: {
                    ...state.filecoin,
                    change: action.data,
                }
            }
        default:
            return state               
    }
}  

export default ethAccountReducer