import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { coingeckoApi } from 'src/utils/coinGeckoApi';
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

interface ICoinGeckoResponse {
    [key: string]: {
        usd: number;
        usd_24h_change: number;
    };
}

export const fetchAssetPrice = createAsyncThunk(
    'assetPrices/fetchAssetPrice',
    async (assetList: string[], thunkAPI) => {
        const response = await coingeckoApi.get('/simple/price', {
            params: {
                ids: assetList.join(','),
                vs_currencies: 'usd',
                include_24hr_change: true,
            },
        });
        return response.data;
    }
);

const assetPricesSlice = createSlice({
    name: 'assetPrices',
    initialState: initialStore,
    reducers: {},
    extraReducers: {
        [fetchAssetPrice.fulfilled.type]: (
            state,
            action: PayloadAction<ICoinGeckoResponse>
        ) => {
            state.isLoading = false;

            const {
                ethereum: { usd: ethPrice, usd_24h_change: ethChange },
                filecoin: { usd: filPrice, usd_24h_change: filChange },
                'usd-coin': { usd: usdcPrice, usd_24h_change: usdcChange },
            } = action.payload;
            state.ethereum.price = ethPrice;
            state.ethereum.change = ethChange;
            state.filecoin.price = filPrice;
            state.filecoin.change = filChange;
            state.usdc.price = usdcPrice;
            state.usdc.change = usdcChange;
        },
        [fetchAssetPrice.pending.type]: state => {
            state.isLoading = true;
        },
        [fetchAssetPrice.rejected.type]: state => {
            state.isLoading = false;
        },
    },
});

export default assetPricesSlice;
