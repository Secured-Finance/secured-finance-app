import * as constants from "./constants";

export function updateCollateralCurrency(data: string) {
	return (dispatch: any) => {
		dispatch(updateCollateralCcyShortName(data))
		switch (data) {
			case "ETH":
				dispatch(updateCollateralCcyIndex(0))
				dispatch(updateCollateralCcyName("Ethereum"))
                break
            case 'FIL':
                dispatch(updateCollateralCcyIndex(1))
                dispatch(updateCollateralCcyName("Filecoin"))
                break    
			case "USDC":
				dispatch(updateCollateralCcyIndex(2))
				dispatch(updateCollateralCcyName("USDC"))
				break
			default:
				break
		}
	}
}

export function updateCollateralCcyIndex(data: number) {
	return {
		type: constants.UPDATE_CCY_INDEX_COLLATERAL_FORM,
		data
	}
}

export function updateCollateralCcyName(data: string) {
	return {
		type: constants.UPDATE_CCY_NAME_COLLATERAL_FORM,
		data
	}
}

export function updateCollateralCcyShortName(data: string) {
	return {
		type: constants.UPDATE_CCY_SHORT_NAME_COLLATERAL_FORM,
		data
	}
}

export function updateCollateralAmount(data: any) {
	return {
		type: constants.UPDATE_AMOUNT_COLLATERAL_FORM,
		data
  	}
}

export function updateCollateralTxFee(data: any) {
	return {
		type: constants.UPDATE_TX_FEE_COLLATERAL_FORM,
		data
	}
}

export function resetCollateralForm() {
	return {
		type: constants.RESET_COLLATERAL_FORM
	}
}


export function fetchCollateralStore() {
	return {
		type: constants.FETCH_COLLATERAL_FORM_STORE
	}
}

export function fetchCollateralStoreFailure() {
	return {
		type: constants.FETCH_COLLATERAL_FORM_STORE_FAILURE
	}
}