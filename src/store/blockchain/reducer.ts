import {
    createListenerMiddleware,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';
import { fetchAssetPrice } from '../assetPrices/reducer';
import { RootState } from '../types';
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
            fetchAssetPrice(['ethereum', 'filecoin', 'usd-coin'])
        );
    },
});
