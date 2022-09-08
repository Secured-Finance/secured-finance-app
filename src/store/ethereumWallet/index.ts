import walletsSlice from './reducer';
export type { WalletsStore as WalletBase, WalletsStore } from './types';

export default walletsSlice.reducer;
export const {
    updateEthWalletBalance,
    updateEthWalletUSDBalance,
    connectEthWallet,
    updateEthWalletPortfolioShare,
    updateEthWalletDailyChange,
    updateEthWalletAssetPrice,
    resetEthWallet,
} = walletsSlice.actions;
