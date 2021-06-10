import { clearError, resetLedgerState } from './state';
import {
    checkLedgerConfiguration,
    setLedgerProvider,
} from './setLedgerProvider';
import {
    setFilWalletProvider,
    setFilWalletType,
} from 'src/services/filecoin/store';
import { Network } from '@glif/filecoin-address';
import { LEDGER } from './constants';
import { updateFilWallet } from 'src/store/wallets/helpers';

const connectWithLedger = async (dispatch: any) => {
    dispatch(clearError());
    dispatch(resetLedgerState());
    const provider = await setLedgerProvider(dispatch);

    console.log(provider);
    if (!provider) return null;
    const configured = await checkLedgerConfiguration(dispatch, provider);
    if (!configured) return null;

    dispatch(setFilWalletProvider(provider));
    dispatch(setFilWalletType(LEDGER));

    const [filAddr] = await provider.wallet.getAccounts(0, 1, Network.TEST);
    const balance = await provider.getBalance(filAddr);

    dispatch(updateFilWallet(balance, filAddr));

    return provider;
};

export default connectWithLedger;
