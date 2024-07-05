import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getEnvShort } from 'src/utils';
import { Blockchain } from './type';

const env = getEnvShort();

const TEMP_ARBITRUM_NETWORK_ID = env === 'prod' ? 42161 : 421614;

const initialState: Blockchain = {
    latestBlock: 0,
    chainId: TEMP_ARBITRUM_NETWORK_ID,
    chainError: true,
    lastActionTimestamp: 0,
    testnetEnabled: false,
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
        updateTestnetEnabled(state, action: PayloadAction<boolean>) {
            state.testnetEnabled = action.payload;
        },
    },
});

export default blockchainSlice;
