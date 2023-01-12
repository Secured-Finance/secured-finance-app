import { RootState } from '../types';

export const isEthereumWalletConnected = (state: RootState) => {
    return !!state.wallet.address;
};

export const selectEthereumBalance = (state: RootState) => {
    return state.wallet.ethBalance;
};

export const selectUSDCBalance = (state: RootState) => {
    return state.wallet.usdcBalance;
};
