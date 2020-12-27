import produce from 'immer'
import * as constants from './constants'
import { defaultEthWallet, defaultFilWallet, WalletsStore } from './types'


const initialStore: WalletsStore = {
    totalUSDBalance: 0,
    ethereum: defaultEthWallet,
    filecoin: defaultFilWallet,
    isLoading: false,
}

const walletsReducer = (state = initialStore, action: any) => produce(state, draft => {
    switch (action.type) {
        case constants.FETCHING_WALLETS:
            draft.isLoading = true
            break
        case constants.FETCHING_WALLETS_FAILURE:
            draft.isLoading = false
            break
        case constants.UPDATE_TOTAL_USD_BALANCE:
            draft.totalUSDBalance = action.data
            draft.isLoading = false
            break
        case constants.UPDATE_ETHEREUM_WALLET_ADDRESS:
            draft.ethereum.address = action.data
            draft.isLoading = false
            break
        case constants.UPDATE_ETHEREUM_WALLET_BALANCE:
            draft.ethereum.balance = action.data
            draft.isLoading = false
            break
        case constants.UPDATE_ETHEREUM_WALLET_USD_BALANCE:
            draft.ethereum.usdBalance = action.data
            draft.isLoading = false
            break
        case constants.UPDATE_ETHEREUM_WALLET_ASSET_PRICE:
            draft.ethereum.assetPrice = action.data
            draft.isLoading = false
            break
        case constants.UPDATE_ETHEREUM_WALLET_PORTFOLIO_SHARE:
            draft.ethereum.portfolioShare = action.data
            draft.isLoading = false
            break
        case constants.UPDATE_ETHEREUM_WALLET_DAILY_CHANGE:
            draft.ethereum.dailyChange = action.data
            draft.isLoading = false
            break
        case constants.UPDATE_FILECOIN_WALLET_ADDRESS:
            draft.filecoin.address = action.data
            draft.isLoading = false
            break
        case constants.UPDATE_FILECOIN_WALLET_BALANCE:
            draft.filecoin.balance = action.data
            draft.isLoading = false
            break
        case constants.UPDATE_FILECOIN_WALLET_USD_BALANCE:
            draft.filecoin.usdBalance = action.data
            draft.isLoading = false
            break
        case constants.UPDATE_FILECOIN_WALLET_ASSET_PRICE:
            draft.filecoin.assetPrice = action.data
            draft.isLoading = false
            break
        case constants.UPDATE_FILECOIN_WALLET_PORTFOLIO_SHARE:
            draft.filecoin.portfolioShare = action.data
            draft.isLoading = false
            break
        case constants.UPDATE_FILECOIN_WALLET_DAILY_CHANGE:
            draft.filecoin.dailyChange = action.data
            draft.isLoading = false
            break
        case constants.UPDATE_ETHEREUM_WALLET_ACTIONS:
            draft.ethereum.actions = action.data
            draft.isLoading = false
            break
        case constants.UPDATE_FILECOIN_WALLET_ACTIONS:
            draft.filecoin.actions = action.data
            draft.isLoading = false
            break
        case constants.RESET_ETHEREUM_WALLET:
            draft.filecoin = defaultEthWallet
            draft.isLoading = false
            break        
        case constants.RESET_FILECOIN_WALLET:
            draft.filecoin = defaultFilWallet
            draft.isLoading = false
            break    
        default:
            break               
    }
})

export default walletsReducer