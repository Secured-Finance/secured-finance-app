import { clearError, resetLedgerState } from './state';
import {
    checkLedgerConfiguration,
    setLedgerProvider,
} from './setLedgerProvider';
import { setFilWalletProvider, setFilWalletType } from '../filecoin/store';
import { updateFilWalletBalance } from '../../store/wallets';
import { Network } from '@glif/filecoin-address';

const connectWithLedger = async (dispatch: any) => {
    dispatch(clearError());
    dispatch(resetLedgerState());
    const provider = await setLedgerProvider(dispatch);

    if (!provider) return null;
    const configured = await checkLedgerConfiguration(dispatch, provider);
    if (!configured) return null;

    dispatch(setFilWalletProvider(provider));
    dispatch(setFilWalletType('Ledger'));

    const [filAddr] = await provider.wallet.getAccounts(0, 1, Network.TEST);
    const balance = await provider.getBalance(filAddr);

    dispatch(updateFilWalletBalance(balance.toNumber()));

    return provider;
};

export default connectWithLedger;
