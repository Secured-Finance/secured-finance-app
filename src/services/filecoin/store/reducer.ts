import Filecoin from '@glif/filecoin-wallet-provider';
import produce from 'immer';
import { WritableDraft } from 'immer/dist/internal';
import * as constants from './constants';
import {
    FilecoinWalletType,
    FilWalletProvider,
    FilWalletProviderAction,
} from './types';

const initialStore: FilWalletProvider = {
    walletType: null,
    walletProvider: null,
    isLoading: false,
};
const filWalletProviderReducer = (
    state = initialStore,
    action: FilWalletProviderAction
): FilWalletProvider =>
    produce(state, draft => {
        switch (action.type) {
            case constants.FETCHING_FILECOIN_WALLET_PROVIDER:
                draft.isLoading = true;
                break;
            case constants.FETCHING_FILECOIN_WALLET_PROVIDER_FAILURE:
                draft.isLoading = false;
                break;
            case constants.UPDATE_WALLET_TYPE:
                draft.walletType = action.data as FilecoinWalletType;
                draft.isLoading = false;
                break;
            case constants.UPDATE_WALLET_PROVIDER:
                draft.walletProvider = action.data as WritableDraft<Filecoin>;
                draft.isLoading = false;
                break;
            case constants.RESET_WALLET_PROVIDER:
                draft.walletProvider = null;
                draft.walletType = null;
                draft.isLoading = false;
                break;
            default:
                break;
        }
    });

export default filWalletProviderReducer;
