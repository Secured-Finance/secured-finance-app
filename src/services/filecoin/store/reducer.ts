import Filecoin from '@glif/filecoin-wallet-provider';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilecoinWalletType, FilWalletProvider } from './types';

const initialStore: FilWalletProvider = {
    walletType: null,
    walletProvider: null,
    isLoading: false,
};

const filWalletSlice = createSlice({
    name: 'filWalletProvider',
    initialState: initialStore,
    reducers: {
        startFetchingFilWalletProvider(state) {
            state.isLoading = true;
        },
        failFetchingFilWalletProvider(state) {
            state.isLoading = false;
        },
        setFilWalletType(state, action: PayloadAction<FilecoinWalletType>) {
            state.walletType = action.payload;
            state.isLoading = false;
        },
        setFilWalletProvider(state, action: PayloadAction<Filecoin>) {
            state.walletProvider = action.payload;
            state.isLoading = false;
        },
        resetFilWalletProvider(state) {
            state.walletProvider = null;
            state.walletType = null;
            state.isLoading = false;
        },
    },
});

export default filWalletSlice;
