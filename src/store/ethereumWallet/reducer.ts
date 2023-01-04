import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { defaultEthWallet, WalletsStore } from './types';

const initialStore: WalletsStore = {
    ...defaultEthWallet,
};

const ethereumWalletSlice = createSlice({
    name: 'ethereumWallet',
    initialState: initialStore,
    reducers: {
        updateEthWalletBalance(state, action: PayloadAction<number>) {
            state.balance = action.payload;
        },
        connectEthWallet(state, action: PayloadAction<string>) {
            state.address = action.payload;
        },
        resetEthWallet(state) {
            state.address = defaultEthWallet.address;
            state.balance = defaultEthWallet.balance;
        },
    },
});

export default ethereumWalletSlice;
