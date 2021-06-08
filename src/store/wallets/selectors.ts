import { RootState } from '../types';
import { WalletsStore } from './types';

export const getAssetPrices = (state: RootState) => ({
    ethereum: state.assetPrices.ethereum,
    filecoin: state.assetPrices.filecoin,
    usdc: state.assetPrices.usdc,
});

export const getFilWallet = (state: RootState) => state.wallets.filecoin;

export const getTotalUSDBalance = (state: RootState) =>
    state.wallets.totalUSDBalance;

export const getFilAddress = (state: RootState) =>
    state.wallets.filecoin.address;

export const getFilUSDBalance = (state: RootState) =>
    state.wallets.filecoin.usdBalance;

export const getEthUSDBalance = (state: RootState) =>
    state.wallets.ethereum.usdBalance;

export const isAnyOtherWalletConnected = (
    state: RootState,
    walletName: 'filecoin' | 'ethereum'
) => {
    const wallets: any = state.wallets;
    for (let key in wallets) {
        if (
            key !== walletName &&
            wallets.hasOwnProperty(key) &&
            wallets[key].actions
        ) {
            return true;
        }
    }
    return false;
};
