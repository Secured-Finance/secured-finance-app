import ledgerSlice from './reducer';

export default ledgerSlice.reducer;
export const {
    setWalletType,
    createWalletProvider,
    setError,
    clearError,
    resetLedgerState,
    resetState,
    userInitiatedImport,
    ledgerNotFound,
    ledgerConnected,
    establishingConnectionWithFilecoinApp,
    lock,
    unlock,
    filecoinAppNotOpen,
    filecoinAppOpen,
    busy,
    replug,
    usedByAnotherApp,
    ledgerBadVersion,
    webUsbUnsupported,
} = ledgerSlice.actions;
