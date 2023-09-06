import walletSlice from './reducer';
export type { WalletsStore } from './types';

export default walletSlice.reducer;
export const { connectEthWallet, resetEthWallet, updateEthBalance } =
    walletSlice.actions;
