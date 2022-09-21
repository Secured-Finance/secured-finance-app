import { RootState } from 'src/store/types';
import { CurrencySymbol } from 'src/utils/currencyList';

export const getAsset = (ccy: CurrencySymbol) => (state: RootState) => {
    return state.assetPrices[ccy];
};

export const getAssetPrice = (ccy: CurrencySymbol) => (state: RootState) => {
    return state.assetPrices[ccy].price;
};

export const getAssetChange = (ccy: CurrencySymbol) => (state: RootState) => {
    return state.assetPrices[ccy].change;
};

export const getPriceMap = (state: RootState) => {
    return {
        [CurrencySymbol.ETH]: state.assetPrices.ETH.price,
        [CurrencySymbol.FIL]: state.assetPrices.FIL.price,
        [CurrencySymbol.USDC]: state.assetPrices.USDC.price,
        [CurrencySymbol.BTC]: state.assetPrices.BTC.price,
    };
};

export const getPriceChangeMap = (state: RootState) => {
    return {
        [CurrencySymbol.ETH]: state.assetPrices.ETH.change,
        [CurrencySymbol.FIL]: state.assetPrices.FIL.change,
        [CurrencySymbol.USDC]: state.assetPrices.USDC.change,
        [CurrencySymbol.BTC]: state.assetPrices.BTC.change,
    };
};
