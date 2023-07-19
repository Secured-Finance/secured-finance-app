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

export type AssetPriceMap = Record<CurrencySymbol, number>;
export const getPriceMap = (state: RootState): AssetPriceMap => {
    return {
        [CurrencySymbol.ETH]: state.assetPrices.ETH.price,
        [CurrencySymbol.WFIL]: state.assetPrices.WFIL.price,
        [CurrencySymbol.USDC]: state.assetPrices.USDC.price,
        [CurrencySymbol.WBTC]: state.assetPrices.WBTC.price,
    };
};

export const getPriceChangeMap = (state: RootState) => {
    return {
        [CurrencySymbol.ETH]: state.assetPrices.ETH.change,
        [CurrencySymbol.WFIL]: state.assetPrices.WFIL.change,
        [CurrencySymbol.USDC]: state.assetPrices.USDC.change,
        [CurrencySymbol.WBTC]: state.assetPrices.WBTC.change,
    };
};
