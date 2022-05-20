import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AssetPrices } from './types';

const initialStore: AssetPrices = {
    ethereum: {
        price: 0,
        change: 0,
    },
    filecoin: {
        price: 0,
        change: 0,
    },
    usdc: {
        price: 0,
        change: 0,
    },
    isLoading: false,
};

const assetPricesSlice = createSlice({
    name: 'assetPrices',
    initialState: initialStore,
    reducers: {
        updateEthUSDPrice: (state, action: PayloadAction<number>) => {
            state.ethereum.price = action.payload;
        },
        updateEthUSDChange: (state, action: PayloadAction<number>) => {
            state.ethereum.change = action.payload;
        },
        updateFilUSDPrice: (state, action: PayloadAction<number>) => {
            state.filecoin.price = action.payload;
        },
        updateFilUSDChange: (state, action: PayloadAction<number>) => {
            state.filecoin.change = action.payload;
        },
        updateUSDCUSDPrice: (state, action: PayloadAction<number>) => {
            state.usdc.price = action.payload;
        },
        updateUSDCUSDChange: (state, action: PayloadAction<number>) => {
            state.usdc.change = action.payload;
        },
    },
});

export default assetPricesSlice;
