import walletSlice from './reducer';
export {
    selectAllBalances,
    selectCollateralCurrencyBalance,
} from './selectors';
export { zeroBalances } from './types';
export type { WalletsStore } from './types';

export default walletSlice.reducer;
export const { connectEthWallet, resetEthWallet, updateBalance } =
    walletSlice.actions;
