import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CurrencySymbol } from 'src/utils';
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
        updateBalance: {
            reducer: (
                state,
                action: PayloadAction<Partial<WalletsStore['balances']>>
            ) => {
                state.balances = {
                    ...state.balances,
                    ...action.payload,
                };
            },
            prepare: (payload: number, ccy: CurrencySymbol) => {
                return { payload: { [ccy]: payload } };
            },
        },
        resetEthWallet(state) {
            state.address = defaultWallet.address;
            state.balances = defaultWallet.balances;
        },
    },
});

export default walletSlice;
