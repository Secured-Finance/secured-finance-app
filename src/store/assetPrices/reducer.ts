import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CurrencySymbol } from 'src/utils';
import { coingeckoApi } from 'src/utils/coinGeckoApi';
import { AssetPrices } from './types';

const initialAssetPrice = { price: 0, change: 0 };

const initialStore: AssetPrices = {
    [CurrencySymbol.ETH]: initialAssetPrice,
    [CurrencySymbol.WFIL]: initialAssetPrice,
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
    extraReducers: builder => {
        builder.addCase(
            fetchAssetPrice.fulfilled,
            (state, action: PayloadAction<ICoinGeckoResponse>) => {
                state.isLoading = false;

                const {
                    ethereum: { usd: ethPrice, usd_24h_change: ethChange },
                    filecoin: { usd: wfilPrice, usd_24h_change: wfilChange },
                    'usd-coin': { usd: usdcPrice, usd_24h_change: usdcChange },
                    'wrapped-bitcoin': {
                        usd: wbtcPrice,
                        usd_24h_change: wbtcChange,
                    },
                } = action.payload;
                state.ETH.price = ethPrice;
                state.ETH.change = ethChange;
                state.WFIL.price = wfilPrice;
                state.WFIL.change = wfilChange;
                state.USDC.price = usdcPrice;
                state.USDC.change = usdcChange;
                state.WBTC.price = wbtcPrice;
                state.WBTC.change = wbtcChange;
            }
        );
        builder.addCase(fetchAssetPrice.pending, state => {
            state.isLoading = true;
        });
        builder.addCase(fetchAssetPrice.rejected, state => {
            state.isLoading = false;
        });
    },
});

export default assetPricesSlice;
