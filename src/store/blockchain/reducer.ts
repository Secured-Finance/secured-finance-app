import {
    createListenerMiddleware,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';
import { currencyMap } from 'src/utils';
import { fetchAssetPrice } from '../assetPrices/reducer';
import { RootState } from '../types';
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

export const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
    predicate: (_action, currentState, previousState) => {
        const prevBlock = (previousState as RootState).blockchain.latestBlock;
        const currBlock = (currentState as RootState).blockchain.latestBlock;
        return currBlock !== prevBlock;
    },

    effect: async (action, listenerApi) => {
        listenerApi.cancelActiveListeners();
        listenerApi.dispatch(
            fetchAssetPrice(Object.values(currencyMap).map(c => c.coinGeckoId))
        );
    },
});
