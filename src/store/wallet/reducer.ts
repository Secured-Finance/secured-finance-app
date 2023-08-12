import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { defaultWallet, WalletsStore } from './types';

const initialStore: WalletsStore = {
    ...defaultWallet,
};

const walletSlice = createSlice({
    name: 'wallet',
    initialState: initialStore,
    reducers: {
        connectEthWallet(state, action: PayloadAction<string>) {
            state.address = action.payload;
        },
        updateEthBalance(state, action: PayloadAction<number>) {
            state.ethBalance = action.payload;
        },
        resetEthWallet(state) {
            state.address = defaultWallet.address;
            state.ethBalance = defaultWallet.ethBalance;
        },
    },
});

export default walletSlice;
