import { MAINNET, MAINNET_PATH_CODE, TESTNET_PATH_CODE } from './constants';
import {
    checkLedgerConfiguration,
    setLedgerProvider,
} from './setLedgerProvider';
import { clearError, resetLedgerState } from './state';
import createPath from './createPath';
import { Dispatch } from 'react';

// a helper function for getting the default wallet associated with the wallet provider
const fetchDefaultWallet = async (dispatch: Dispatch<{ type: string }>) => {
    const network = MAINNET;
    dispatch(clearError());
    dispatch(resetLedgerState());
    const provider = await setLedgerProvider(dispatch);
    if (!provider) return null;
    const configured = await checkLedgerConfiguration(dispatch, provider);
    if (!configured) return null;

    // @ts-ignore
    const [defaultAddress] = await provider.wallet.getAccounts(network, 0, 1);
    const balance = await provider.getBalance(defaultAddress);
    const networkCode =
        network === MAINNET ? MAINNET_PATH_CODE : TESTNET_PATH_CODE;

    let path = createPath(networkCode, 0);

    return {
        balance,
        address: defaultAddress,
        path,
    };
};

export default fetchDefaultWallet;
