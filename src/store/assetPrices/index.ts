import { AssetPrices } from './types';

export type { AssetPrices, AssetPrice } from './types';
export { default } from './reducer';
export * from './actions';

export const AssetPricesSelector = (state: { assetPrices: AssetPrices }) =>
    state.assetPrices;
