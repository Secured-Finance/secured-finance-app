import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Blockchain } from './type';

const initialState: Blockchain = {
    latestBlock: 0,
};

const blockchainSlice = createSlice({
    name: 'blockchain',
    initialState,
    reducers: {
        updateLatestBlock(state, action: PayloadAction<number>) {
            state.latestBlock = action.payload;
        },
    },
});

export default blockchainSlice;
