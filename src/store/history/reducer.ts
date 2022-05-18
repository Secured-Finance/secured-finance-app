import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HistoryStore, HistoryTableData } from './types';

const initialStore: HistoryStore = {
    lendingHistory: [],
    borrowingHistory: [],
    isLoading: false,
};

export const historySlice = createSlice({
    name: 'history',
    initialState: initialStore,
    reducers: {
        startSetHistory: state => {
            state.isLoading = true;
        },
        setBorrowingHistory: (
            state,
            action: PayloadAction<Array<HistoryTableData>>
        ) => {
            state.borrowingHistory = action.payload;
            state.isLoading = false;
        },
        setLendingHistory: (
            state,
            action: PayloadAction<Array<HistoryTableData>>
        ) => {
            state.lendingHistory = action.payload;
            state.isLoading = false;
        },
        failSetLendingHistory: state => {
            state.isLoading = false;
        },
        failSetBorrowingHistory: state => {
            state.isLoading = false;
        },
    },
});

export default historySlice;
