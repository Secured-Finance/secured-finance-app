import { RootState } from 'src/store/types';

export const getFilPrice = (state: RootState) =>
    state.assetPrices.filecoin.price;
export const getEthPrice = (state: RootState) =>
    state.assetPrices.ethereum.price;
export const getUSDCPrice = (state: RootState) => state.assetPrices.usdc.price;
