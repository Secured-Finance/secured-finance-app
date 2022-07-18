import { RootState } from 'src/store/types';
import { Currency } from 'src/utils/currencyList';

export const getAssetInfo = (ccy: Currency) => (state: RootState) => {
    switch (ccy) {
        case Currency.ETH:
            return state.assetPrices.ethereum;
        case Currency.FIL:
            return state.assetPrices.filecoin;
        case Currency.USDC:
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
        [Currency.ETH]: state.assetPrices.ethereum.price,
        [Currency.FIL]: state.assetPrices.filecoin.price,
        [Currency.USDC]: state.assetPrices.usdc.price,
    };
};

export const getPriceChangeMap = (state: RootState) => {
    return {
        [Currency.ETH]: state.assetPrices.ethereum.change,
        [Currency.FIL]: state.assetPrices.filecoin.change,
        [Currency.USDC]: state.assetPrices.usdc.change,
    };
};
