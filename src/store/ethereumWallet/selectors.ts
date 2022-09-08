import { RootState } from '../types';

export const isEthereumWalletConnected = (state: RootState) => {
    return !!state.ethereumWallet.address;
};

export const selectEthereumBalance = (state: RootState) => {
    return state.ethereumWallet.balance;
};
