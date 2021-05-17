import { clearError, resetLedgerState } from './state';
import {
    checkLedgerConfiguration,
    setLedgerProvider,
} from './setLedgerProvider';
import { Dispatch } from 'react';

const connectWithLedger = async (dispatch: Dispatch<{ type: string }>) => {
    dispatch(clearError());
    dispatch(resetLedgerState());
    const provider = await setLedgerProvider(dispatch);
    if (!provider) return null;
    const configured = await checkLedgerConfiguration(dispatch, provider);
    if (!configured) return null;
    return provider;
};

export default connectWithLedger;
