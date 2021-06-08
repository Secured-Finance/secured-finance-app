import * as constants from './constants';
import { FilecoinNumber } from '@glif/filecoin-number';

export function updateSendCurrency(data: string) {
    return (dispatch: any) => {
        dispatch(updateSendCcyShortName(data));
        switch (data) {
            case 'ETH':
                dispatch(updateSendCcyIndex(0));
                dispatch(updateSendCcyName('Ethereum'));
                break;
            case 'FIL':
                dispatch(updateSendCcyIndex(1));
                dispatch(updateSendCcyName('Filecoin'));
                break;
            case 'USDC':
                dispatch(updateSendCcyIndex(2));
                dispatch(updateSendCcyName('USDC'));
                break;
            default:
                break;
        }
    };
}

export function updateSendCcyIndex(data: number) {
    return {
        type: constants.UPDATE_CCY_INDEX,
        data,
    };
}

export function updateSendCcyName(data: string) {
    return {
        type: constants.UPDATE_CCY_NAME,
        data,
    };
}

export function updateSendCcyShortName(data: string) {
    return {
        type: constants.UPDATE_CCY_SHORT_NAME,
        data,
    };
}

export function updateSendAmount(data: any) {
    return {
        type: constants.UPDATE_AMOUNT,
        data,
    };
}

export function updateSendToAddreess(data: string) {
    return {
        type: constants.UPDATE_TO_ADDRESS,
        data,
    };
}

export function updateSendTxFee(data: number) {
    return {
        type: constants.UPDATE_TX_FEE,
        data,
    };
}

export function updateSendGasPrice(data: any) {
    return {
        type: constants.UPDATE_GAS_PRICE,
        data,
    };
}

export function resetSendForm() {
    return {
        type: constants.RESET_SEND_FORM,
    };
}

export function fetchSendStore() {
    return {
        type: constants.FETCH_SEND_STORE,
    };
}

export function fetchSendStoreFailure() {
    return {
        type: constants.FETCH_SEND_STORE_FAILURE,
    };
}

export function setMaxTxFee(data: FilecoinNumber) {
    return {
        type: constants.SET_MAX_TX_FEE,
        data,
    };
}
