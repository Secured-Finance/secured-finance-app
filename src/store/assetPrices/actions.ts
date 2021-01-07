import * as constants from './constants'

export function updateEthUSDPrice(data: number) {
	return {
		type: constants.UPDATE_ETHEREUM_USD_PRICE,
		data
	}
}

export function updateEthUSDChange(data: number) {
	return {
		type: constants.UPDATE_ETHEREUM_USD_CHANGE,
		data
	}
}

export function updateFilUSDPrice(data: number) {
	return {
		type: constants.UPDATE_FILECOIN_USD_PRICE,
		data
	}
}

export function updateFilUSDChange(data: number) {
	return {
		type: constants.UPDATE_FILECOIN_USD_CHANGE,
		data
	}
}

export function updateUSDCUSDPrice(data: number) {
	return {
		type: constants.UPDATE_USDC_USD_PRICE,
		data
	}
}

export function updateUSDCUSDChange(data: number) {
	return {
		type: constants.UPDATE_USDC_USD_CHANGE,
		data
	}
}

export function fetchAssetPrice() {
	return {
		type: constants.FETCHING_ASSET_PRICE,
	}
}

export function fetchAssetPriceFailure() {
	return {
		type: constants.FETCHING_ASSET_PRICE_FAILURE,
	}
}
