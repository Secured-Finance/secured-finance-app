import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CurrencySymbol } from 'src/utils';
import { coingeckoApi } from 'src/utils/coinGeckoApi';
import { AssetPrices } from './types';

const initialAssetPrice = { price: 0, change: 0 };

const initialStore: AssetPrices = {
    [CurrencySymbol.ETH]: initialAssetPrice,
    [CurrencySymbol.FIL]: initialAssetPrice,
    [CurrencySymbol.USDC]: initialAssetPrice,
    [CurrencySymbol.WBTC]: initialAssetPrice,
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
    async (assetList: string[]) => {
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
                bitcoin: { usd: btcPrice, usd_24h_change: btcChange },
            } = action.payload;
            state.ETH.price = ethPrice;
            state.ETH.change = ethChange;
            state.FIL.price = filPrice;
            state.FIL.change = filChange;
            state.USDC.price = usdcPrice;
            state.USDC.change = usdcChange;
            state.WBTC.price = btcPrice;
            state.WBTC.change = btcChange;
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
