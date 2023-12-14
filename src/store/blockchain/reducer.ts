import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Blockchain } from './type';

const initialState: Blockchain = {
    latestBlock: 0,
    chainId: 0,
    chainError: true,
    lastActionTimestamp: 0,
};

const blockchainSlice = createSlice({
    name: 'blockchain',
    initialState,
    reducers: {
        updateLatestBlock(state, action: PayloadAction<number>) {
            state.latestBlock = action.payload;
        },
        updateChainId(state, action: PayloadAction<number>) {
            state.chainId = action.payload;
        },
        updateChainError(state, action: PayloadAction<boolean>) {
            state.chainError = action.payload;
        },
        updateLastActionTimestamp(state) {
            state.lastActionTimestamp = Date.now();
        },
    },
});

export default blockchainSlice;
