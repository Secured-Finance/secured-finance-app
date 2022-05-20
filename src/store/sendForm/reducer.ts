import { FilecoinNumber } from '@glif/filecoin-number';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Currency, getCurrencyBy } from 'src/utils/currencyList';
import { defaultStore, SendFormStore } from './types';

const initialStore: SendFormStore = defaultStore;

const sendFormSlice = createSlice({
    name: 'sendForm',
    initialState: initialStore,
    reducers: {
        updateSendCurrency: (state, action: PayloadAction<Currency>) => {
            const { fullName, indexCcy, shortName } = getCurrencyBy(
                'shortName',
                action.payload
            );
            state.currencyIndex = indexCcy;
            state.currencyName = fullName;
            state.currencyShortName = shortName;
        },
        updateSendCcyIndex: (state, action: PayloadAction<number>) => {
            state.currencyIndex = action.payload;
            state.isLoading = false;
        },
        updateSendCcyName: (state, action: PayloadAction<string>) => {
            state.currencyName = action.payload;
            state.isLoading = false;
        },
        updateSendCcyShortName: (state, action: PayloadAction<string>) => {
            state.currencyShortName = action.payload;
            state.isLoading = false;
        },
        updateSendAmount: (state, action: PayloadAction<number>) => {
            state.amount = action.payload;
            state.isLoading = false;
        },
        updateSendToAddress: (state, action: PayloadAction<string>) => {
            state.toAddress = action.payload;
            state.isLoading = false;
        },
        updateSendTxFee: (state, action: PayloadAction<number>) => {
            state.txFee = action.payload;
            state.isLoading = false;
        },
        updateSendGasPrice: (state, action: PayloadAction<number>) => {
            state.gasPrice = action.payload;
            state.isLoading = false;
        },
        resetSendForm: state => {
            state = initialStore;
        },
        fetchSendStore: state => {
            state.isLoading = true;
        },
        fetchSendStoreFailure: state => {
            state.isLoading = false;
        },
        setMaxTxFee: (state, action: PayloadAction<FilecoinNumber>) => {
            state.maxTxFee = action.payload;
            state.isLoading = false;
        },
    },
});

export default sendFormSlice;
