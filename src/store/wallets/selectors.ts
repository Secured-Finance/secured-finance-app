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

export const getEthBalance = (state: RootState) =>
    state.wallets.ethereum.balance;
export const getFilBalance = (state: RootState) =>
    state.wallets.filecoin.balance;

export const isAnyWalletConnected = (
    state: RootState,
    walletName?: 'filecoin' | 'ethereum'
) => {
    const wallets = state.wallets;
    for (const key in wallets) {
        if (
            wallets.hasOwnProperty(key) &&
            wallets[key as keyof WalletsStore].hasOwnProperty('actions')
        ) {
            if (walletName) {
                if (key !== walletName) return true;
            } else {
                return true;
            }
        }
    }
    return false;
};

export const getFilActions = (state: RootState) =>
    state.wallets.filecoin.actions;
