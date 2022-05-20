import assetPricesSlice from './reducer';
import { AssetPrices } from './types';
export type { AssetPrice, AssetPrices } from './types';

export const AssetPricesSelector = (state: { assetPrices: AssetPrices }) =>
    state.assetPrices;

export const {
    updateEthUSDPrice,
    updateEthUSDChange,
    updateFilUSDPrice,
    updateFilUSDChange,
    updateUSDCUSDPrice,
    updateUSDCUSDChange,
    fetchAssetPrice,
    fetchAssetPriceFailure,
} = assetPricesSlice.actions;

export default assetPricesSlice.reducer;
