import {
    setFilWalletProvider,
    setFilWalletType,
} from 'src/services/filecoin/store';
import { getFilecoinNetwork } from 'src/services/filecoin/utils';
import { updateFilWallet } from 'src/store/wallets/helpers';
import { FilecoinWalletType } from '../filecoin/store/types';
import {
    checkLedgerConfiguration,
    setLedgerProvider,
} from './setLedgerProvider';
import { clearError, resetLedgerState } from './state';

const connectWithLedger = async (dispatch: any) => {
    dispatch(clearError());
    dispatch(resetLedgerState());
    const provider = await setLedgerProvider(dispatch);

    if (!provider) return null;
    const configured = await checkLedgerConfiguration(dispatch, provider);
    if (!configured) return null;

    dispatch(setFilWalletProvider(provider));
    dispatch(setFilWalletType(FilecoinWalletType.Ledger));

    const [filAddr] = await provider.wallet.getAccounts(
        0,
        1,
        getFilecoinNetwork()
    );
    const balance = await provider.getBalance(filAddr);

    //TODO: add something here
    dispatch(updateFilWallet(balance, filAddr));

    return provider;
};

export default connectWithLedger;
