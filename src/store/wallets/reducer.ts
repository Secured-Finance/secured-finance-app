import * as constants from './constants'
import { WalletsStore } from './types'


const initialStore: WalletsStore = {
    totalUSDBalance: 0,
    ethereum: {
        ccyIndex: 0,
        address: "",
        balance: 0,
        usdBalance: 0,
        assetPrice: 0,
        portfolioShare: 0,
        dailyChange: 0,
    },
    filecoin: {
        ccyIndex: 1,
        address: "",
        balance: 0,
        usdBalance: 0,
        assetPrice: 0,
        portfolioShare: 0,
        dailyChange: 0,
    },
    isLoading: false,
}

function walletsReducer(state = initialStore, action: any) {
    switch (action.type) {
        case constants.FETCHING_WALLETS:
            return {
                ...Object.freeze(state),
                isLoading: true
            }
        case constants.FETCHING_WALLETS_FAILURE:
            return {
                ...Object.freeze(state),
                isLoading: false,
            }
        case constants.UPDATE_TOTAL_USD_BALANCE:
            return {
                ...Object.freeze(state),
                totalUSDBalance: action.data,
                isLoading: false,
            }
        case constants.UPDATE_ETHEREUM_WALLET_ADDRESS:
            return {
                ...Object.freeze(state),
                ethereum: {
                    ...state.ethereum,
                    address: action.data,
                },
                isLoading: false,
            }
        case constants.UPDATE_ETHEREUM_WALLET_BALANCE:
            return {
                ...Object.freeze(state),
                ethereum: {
                    ...state.ethereum,
                    balance: action.data,
                },
                isLoading: false,
            }
        case constants.UPDATE_ETHEREUM_WALLET_USD_BALANCE:
            return {
                ...Object.freeze(state),
                ethereum: {
                    ...state.ethereum,
                    usdBalance: action.data,
                },
                isLoading: false,
            }
        case constants.UPDATE_ETHEREUM_WALLET_ASSET_PRICE:
            return {
                ...Object.freeze(state),
                ethereum: {
                    ...state.ethereum,
                    assetPrice: action.data,
                },
                isLoading: false,
            }
        case constants.UPDATE_ETHEREUM_WALLET_PORTFOLIO_SHARE:
            return {
                ...Object.freeze(state),
                ethereum: {
                    ...state.ethereum,
                    portfolioShare: action.data,
                },
                isLoading: false,
            }
        case constants.UPDATE_ETHEREUM_WALLET_DAILY_CHANGE:
            return {
                ...Object.freeze(state),
                ethereum: {
                    ...state.ethereum,
                    dailyChange: action.data,
                },
                isLoading: false,
            }
        case constants.UPDATE_FILECOIN_WALLET_ADDRESS:
            return {
                ...Object.freeze(state),
                filecoin: {
                    ...state.filecoin,
                    address: action.data,
                },
                isLoading: false,
            }
        case constants.UPDATE_FILECOIN_WALLET_BALANCE:
            return {
                ...Object.freeze(state),
                filecoin: {
                    ...state.filecoin,
                    balance: action.data,
                },
                isLoading: false,
            }
        case constants.UPDATE_FILECOIN_WALLET_USD_BALANCE:
            return {
                ...Object.freeze(state),
                filecoin: {
                    ...state.filecoin,
                    usdBalance: action.data,
                },
                isLoading: false,
            }
        case constants.UPDATE_FILECOIN_WALLET_ASSET_PRICE:
            return {
                ...Object.freeze(state),
                filecoin: {
                    ...state.filecoin,
                    assetPrice: action.data,
                },
                isLoading: false,
            }
        case constants.UPDATE_FILECOIN_WALLET_PORTFOLIO_SHARE:
            return {
                ...Object.freeze(state),
                filecoin: {
                    ...state.filecoin,
                    portfolioShare: action.data,
                },
                isLoading: false,
            }
        case constants.UPDATE_FILECOIN_WALLET_DAILY_CHANGE:
            return {
                ...Object.freeze(state),
                filecoin: {
                    ...state.filecoin,
                    dailyChange: action.data,
                },
                isLoading: false,
            }
        case constants.UPDATE_ETHEREUM_WALLET_ACTIONS:
            return {
                ...Object.freeze(state),
                ethereum: {
                    ...state.ethereum,
                    actions: action.data,
                },
                isLoading: false,
            }
        case constants.UPDATE_FILECOIN_WALLET_ACTIONS:
            return {
                ...Object.freeze(state),
                filecoin: {
                    ...state.filecoin,
                    actions: action.data,
                },
                isLoading: false,
            }
        default:
            return state               
    }
}  

export default walletsReducer