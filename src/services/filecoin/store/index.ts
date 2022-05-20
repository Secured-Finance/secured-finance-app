import filWalletSlice from './reducer';

export type { FilWalletProvider } from './types';

export const {
    startFetchingFilWalletProvider,
    failFetchingFilWalletProvider,
    setFilWalletType,
    setFilWalletProvider,
    resetFilWalletProvider,
} = filWalletSlice.actions;
export default filWalletSlice.reducer;
