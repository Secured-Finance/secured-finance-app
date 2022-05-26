import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TransactionStatus, TransactionStore } from './types';

const initialState: TransactionStore = {
    hash: '',
    status: null,
    settlementHash: '',
    error: null,
};

const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        updateHash(state, action: PayloadAction<string>) {
            state.hash = action.payload;
        },
        updateStatus(state, action: PayloadAction<TransactionStore['status']>) {
            state.status = action.payload;
        },
        updateSettlementHash(state, action: PayloadAction<string>) {
            state.settlementHash = action.payload;
        },
        updateTransaction: {
            reducer(
                state,
                action: PayloadAction<{
                    hash: TransactionStore['hash'];
                    status: TransactionStore['status'];
                }>
            ) {
                state.hash = action.payload.hash;
                state.status = action.payload.status;
            },
            prepare(
                hash: TransactionStore['hash'],
                status: TransactionStore['status']
            ) {
                return {
                    payload: {
                        hash,
                        status,
                    },
                };
            },
        },
        transactionFailed(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.status = TransactionStatus.Error;
        },
        resetTransaction(state) {
            state.hash = '';
            state.status = null;
            state.settlementHash = '';
            state.error = null;
        },
    },
});

export default transactionSlice;
