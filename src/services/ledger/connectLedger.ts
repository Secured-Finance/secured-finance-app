import { clearError, resetLedgerState } from './state';
import {
    checkLedgerConfiguration,
    setLedgerProvider,
} from './setLedgerProvider';
import { Dispatch } from 'react';
import { setFilWalletProvider, setFilWalletType } from '../filecoin/store';

const connectWithLedger = async (
    dispatch: Dispatch<{ type: string; payload?: any }>
) => {
    dispatch(clearError());
    dispatch(resetLedgerState());
    const provider = await setLedgerProvider(dispatch);
    if (!provider) return null;
    const configured = await checkLedgerConfiguration(dispatch, provider);
    if (!configured) return null;
    await dispatch(setFilWalletProvider(provider));
    dispatch(setFilWalletType('Ledger'));
    return provider;
};

export default connectWithLedger;
