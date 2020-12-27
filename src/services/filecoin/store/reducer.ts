import produce from 'immer'
import * as constants from './constants'
import { FilWalletProvider } from './types'

const initialStore: FilWalletProvider = {
    walletType: null,
    walletProvider: null,
    isLoading: false,
}

const filWalletProviderReducer = (state = initialStore, action: any) =>
    produce(state, draft => {
        switch (action.type) {
            case constants.FETCHING_FILECOIN_WALLET_PROVIDER:
                draft.isLoading = true
                break
            case constants.FETCHING_FILECOIN_WALLET_PROVIDER_FAILURE:
                draft.isLoading = false
                break
            case constants.UPDATE_WALLET_TYPE:
                draft.walletType = action.data
                draft.isLoading = false
                break
            case constants.UPDATE_WALLET_PROVIDER:
                draft.walletProvider = action.data
                draft.isLoading = false
                break
            case constants.RESET_WALLET_PROVIDER:
                draft.walletProvider = null
                draft.walletType = null
                draft.isLoading = false
                break
            default:
                break
        }
})

export default filWalletProviderReducer