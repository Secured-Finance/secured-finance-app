import { RootState } from '../types';

export const isAnyWalletConnected = (state: RootState) => {
    return !!state.ethereumWallet.address;
};
