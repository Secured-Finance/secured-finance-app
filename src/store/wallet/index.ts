import walletSlice from './reducer';
export {
    isEthereumWalletConnected,
    selectEthereumBalance,
    selectUSDCBalance,
} from './selectors';
export type { WalletsStore } from './types';

export default walletSlice.reducer;
export const {
    updateEthBalance,
    updateUsdcBalance,
    connectEthWallet,
    resetEthWallet,
} = walletSlice.actions;
