import { RootState } from '../types';

export const getAssetPrices = (state: RootState) => ({
    ethereum: state.assetPrices.ethereum,
    filecoin: state.assetPrices.filecoin,
    usdc: state.assetPrices.usdc,
});
