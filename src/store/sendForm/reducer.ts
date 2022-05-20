import { FilecoinNumber } from '@glif/filecoin-number';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { defaultStore, SendFormStore } from './types';

const initialStore: SendFormStore = defaultStore;

const sendFormSlice = createSlice({
    name: 'sendForm',
    initialState: initialStore,
    reducers: {
        updateSendTxFee: (state, action: PayloadAction<number>) => {
            state.txFee = action.payload;
            state.isLoading = false;
        },
        updateSendGasPrice: (state, action: PayloadAction<number>) => {
            state.gasPrice = action.payload;
            state.isLoading = false;
        },
        setMaxTxFee: (state, action: PayloadAction<FilecoinNumber>) => {
            state.maxTxFee = action.payload;
            state.isLoading = false;
        },
    },
});

export default sendFormSlice;
