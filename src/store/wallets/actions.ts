import * as constants from './constants'

export function updateEthWalletBalance(data: number) {
	return {
		type: constants.UPDATE_ETHEREUM_WALLET_BALANCE,
		data
	}
}

export function updateEthWalletUSDBalance(data: number) {
	return {
		type: constants.UPDATE_ETHEREUM_WALLET_USD_BALANCE,
		data
	}
}

export function updateEthWalletAddress(data: string) {
	return {
		type: constants.UPDATE_ETHEREUM_WALLET_ADDRESS,
		data
	}
}

export function updateEthWalletPortfolioShare(data: number) {
	return {
		type: constants.UPDATE_ETHEREUM_WALLET_PORTFOLIO_SHARE,
		data
	}
}

export function updateEthWalletDailyChange(data: number) {
	return {
		type: constants.UPDATE_ETHEREUM_WALLET_DAILY_CHANGE,
		data
	}
}

export function updateEthWalletAssetPrice(data: number) {
	return {
		type: constants.UPDATE_ETHEREUM_WALLET_ASSET_PRICE,
		data
	}
}

export function updateEthWalletActions(data: object) {
	return {
		type: constants.UPDATE_ETHEREUM_WALLET_ACTIONS,
		data
	}
}

export function updateTotalUSDBalance(data: number) {
	return {
		type: constants.UPDATE_TOTAL_USD_BALANCE,
		data
	}
}

export function fetchWallet() {
	return {
		type: constants.FETCHING_WALLETS,
	}
}

export function fetchWalletFailure() {
	return {
		type: constants.FETCHING_WALLETS_FAILURE,
	}
}