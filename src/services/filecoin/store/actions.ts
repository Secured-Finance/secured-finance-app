import Filecoin from '@glif/filecoin-wallet-provider';
import * as constants from './constants';
import { FilecoinWalletType, FilWalletProviderAction } from './types';

export function startFetchingFilWalletProvider(): FilWalletProviderAction {
    return {
        type: constants.FETCHING_FILECOIN_WALLET_PROVIDER,
    };
}

export function failFetchingFilWalletProvider(): FilWalletProviderAction {
    return {
        type: constants.FETCHING_FILECOIN_WALLET_PROVIDER_FAILURE,
    };
}

export function setFilWalletType(
    data: FilecoinWalletType
): FilWalletProviderAction {
    return {
        type: constants.UPDATE_WALLET_TYPE,
        data,
    };
}

export function setFilWalletProvider(data: Filecoin): FilWalletProviderAction {
    return {
        type: constants.UPDATE_WALLET_PROVIDER,
        data,
    };
}

export function resetFilWalletProvider(): FilWalletProviderAction {
    return {
        type: constants.RESET_WALLET_PROVIDER,
    };
}
