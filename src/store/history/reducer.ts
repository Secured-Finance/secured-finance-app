import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HistoryStore, HistoryTableData } from './types';

const initialStore: HistoryStore = {
    lendingHistory: [],
    borrowingHistory: [],
};

export const historySlice = createSlice({
    name: 'history',
    initialState: initialStore,
    reducers: {
        setBorrowingHistory: (
            state,
            action: PayloadAction<Array<HistoryTableData>>
        ) => {
            state.borrowingHistory = action.payload;
        },
        setLendingHistory: (
            state,
            action: PayloadAction<Array<HistoryTableData>>
        ) => {
            state.lendingHistory = action.payload;
        },
    },
});

export default historySlice;
