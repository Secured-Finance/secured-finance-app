import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { defaultWallet, WalletsStore } from './types';

const initialStore: WalletsStore = {
    ...defaultWallet,
};

const walletSlice = createSlice({
    name: 'wallet',
    initialState: initialStore,
    reducers: {
        updateEthBalance(state, action: PayloadAction<number>) {
            state.ethBalance = action.payload;
        },
        updateUsdcBalance(state, action: PayloadAction<number>) {
            state.usdcBalance = action.payload;
        },
        connectEthWallet(state, action: PayloadAction<string>) {
            state.address = action.payload;
        },
        resetEthWallet(state) {
            state.address = defaultWallet.address;
            state.ethBalance = defaultWallet.ethBalance;
            state.usdcBalance = defaultWallet.usdcBalance;
        },
    },
});

export default walletSlice;
