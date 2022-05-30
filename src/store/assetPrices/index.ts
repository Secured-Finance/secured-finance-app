import assetPricesSlice from './reducer';
import { AssetPrices } from './types';
export type { AssetPrice, AssetPrices } from './types';

export const AssetPricesSelector = (state: { assetPrices: AssetPrices }) =>
    state.assetPrices;

export default assetPricesSlice.reducer;
