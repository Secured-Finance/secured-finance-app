import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RatesStore } from './types';

const initialStore: RatesStore = {
    borrowingRates: [],
    lendingRates: [],
    midRates: [],
    isLoading: false,
};

const ratesSlice = createSlice({
    name: 'rates',
    initialState: initialStore,
    reducers: {
        setBorrowingRates(state, action: PayloadAction<Array<number>>) {
            state.borrowingRates = action.payload;
        },
        setLendingRates(state, action: PayloadAction<Array<number>>) {
            state.lendingRates = action.payload;
        },
        setMidRates(state, action: PayloadAction<Array<number>>) {
            state.midRates = action.payload;
        },
        startSetRates(state) {
            state.isLoading = true;
        },
        setRatesFail(state) {
            state.isLoading = false;
            state = initialStore;
        },
    },
});

export default ratesSlice;
