import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { defaultWallet, WalletsStore } from './types';

const initialStore: WalletsStore = {
    ...defaultWallet,
};

const walletSlice = createSlice({
    name: 'wallet',
    initialState: initialStore,
    reducers: {
        connectWallet(state, action: PayloadAction<string>) {
            state.address = action.payload;
        },
        updateBalance(state, action: PayloadAction<string>) {
            state.balance = action.payload;
        },
        resetWallet(state) {
            state.address = defaultWallet.address;
            state.balance = defaultWallet.balance;
        },
    },
});

export default walletSlice;
