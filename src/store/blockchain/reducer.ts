import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Environment } from 'src/utils';
import { mainnet, sepolia } from 'viem/chains';
import { Blockchain } from './type';

const initialState: Blockchain = {
    latestBlock: 0,
    chainId:
        process.env.SF_ENV === Environment.PRODUCTION ? mainnet.id : sepolia.id,
    chainError: false,
    lastActionTimestamp: 0,
    testnetEnabled: !(process.env.SF_ENV === Environment.PRODUCTION),
    isChainIdDetected: false,
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
            // In non-production environments, testnetEnabled is always true (locked)
            if (process.env.SF_ENV !== Environment.PRODUCTION) {
                state.testnetEnabled = true;
                return;
            }
            // In production, allow toggling
            state.testnetEnabled = action.payload;
        },
        updateIsChainIdDetected(state, action: PayloadAction<boolean>) {
            state.isChainIdDetected = action.payload;
        },
    },
});

export default blockchainSlice;
