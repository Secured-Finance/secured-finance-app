import Filecoin from '@glif/filecoin-wallet-provider';
import * as constants from './constants';

export function startFetchingFilWalletProvider() {
	return {
		type: constants.FETCHING_FILECOIN_WALLET_PROVIDER,
	}
}

export function failFetchingFilWalletProvider() {
	return {
		type: constants.FETCHING_FILECOIN_WALLET_PROVIDER_FAILURE,
	}
}

export function setFilWalletType(data: string) {
	return {
        type: constants.UPDATE_WALLET_TYPE,
        data
	}
}

export function setFilWalletProvider(data: Filecoin) {
	return {
        type: constants.UPDATE_WALLET_PROVIDER,
        data
    }
}

export function resetFilWalletProvider() {
	return {
        type: constants.RESET_WALLET_PROVIDER,
	}
}
