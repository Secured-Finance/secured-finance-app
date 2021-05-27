import { RootState } from '../types';

export const getAssetPrices = (state: RootState) => ({
    ethereum: state.assetPrices.ethereum,
    filecoin: state.assetPrices.filecoin,
    usdc: state.assetPrices.usdc,
});

export const getTotalUSDBalance = (state: RootState) =>
    state.wallets.totalUSDBalance;

export const getFilAddress = (state: RootState) =>
    state.wallets.filecoin.address;

export const getFilUSDBalance = (state: RootState) =>
    state.wallets.filecoin.usdBalance;

export const getEthUSDBalance = (state: RootState) =>
    state.wallets.ethereum.usdBalance;
