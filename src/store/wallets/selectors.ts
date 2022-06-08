import { RootState } from '../types';

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
    if (walletName) {
        return !!state.wallets[walletName].address;
    }
    return !!state.wallets.filecoin.address || !!state.wallets.ethereum.address;
};

export const getBalance = (
    state: RootState,
    walletName: 'filecoin' | 'ethereum' | 'usdc'
) => {
    if (walletName === 'usdc') {
        return 0;
    }
    return state.wallets[walletName].balance;
};
