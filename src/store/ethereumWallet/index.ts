import walletsSlice from './reducer';
export { isEthereumWalletConnected, selectEthereumBalance } from './selectors';
export type { WalletsStore } from './types';

export default walletsSlice.reducer;
export const {
    updateEthWalletBalance,
    updateEthWalletUSDBalance,
    connectEthWallet,
    resetEthWallet,
} = walletsSlice.actions;
