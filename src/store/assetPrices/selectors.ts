import { RootState } from 'src/store/types';
import { CurrencySymbol } from 'src/utils/currencyList';

export const getAssetInfo = (ccy: CurrencySymbol) => (state: RootState) => {
    switch (ccy) {
        case CurrencySymbol.ETH:
            return state.assetPrices.ethereum;
        case CurrencySymbol.FIL:
            return state.assetPrices.filecoin;
        case CurrencySymbol.USDC:
            return state.assetPrices.usdc;
    }
};
export const getFilPrice = (state: RootState) =>
    state.assetPrices.filecoin.price;
export const getEthPrice = (state: RootState) =>
    state.assetPrices.ethereum.price;
export const getUSDCPrice = (state: RootState) => state.assetPrices.usdc.price;

export const getPriceMap = (state: RootState) => {
    return {
        [CurrencySymbol.ETH]: state.assetPrices.ethereum.price,
        [CurrencySymbol.FIL]: state.assetPrices.filecoin.price,
        [CurrencySymbol.USDC]: state.assetPrices.usdc.price,
    };
};

export const getPriceChangeMap = (state: RootState) => {
    return {
        [CurrencySymbol.ETH]: state.assetPrices.ethereum.change,
        [CurrencySymbol.FIL]: state.assetPrices.filecoin.change,
        [CurrencySymbol.USDC]: state.assetPrices.usdc.change,
    };
};
