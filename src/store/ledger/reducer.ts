import Filecoin from '@glif/filecoin-wallet-provider';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialLedgerState } from 'src/services/ledger/ledgerStateManagement';
import { LedgerStore } from './types';

const initialStore: LedgerStore = {
    walletType: '',
    walletProvider: null,
    error: '',
    ledger: initialLedgerState,
};

const ledgerSlice = createSlice({
    name: 'ledger',
    initialState: initialStore,
    reducers: {
        setWalletType: (state, action: PayloadAction<string>) => {
            state.walletType = action.payload;
        },
        createWalletProvider: (state, action: PayloadAction<Filecoin>) => {
            state.walletProvider = action.payload;
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        clearError(state) {
            state.error = '';
        },
        resetLedgerState(state) {
            state.ledger = initialLedgerState;
        },
        resetState() {
            initialStore;
        },
        userInitiatedImport(state) {
            state.ledger.connecting = true;
            state.ledger.connectedFailure = false;
        },
        ledgerNotFound(state) {
            state.ledger.connecting = false;
            state.ledger.connectedFailure = true;
            state.ledger.userImportFailure = true;
        },
        ledgerConnected(state) {
            state.ledger.connecting = false;
            state.ledger.connectedFailure = false;
            state.ledger.inUseByAnotherApp = false;
        },
        establishingConnectionWithFilecoinApp(state) {
            state.ledger.filecoinAppNotOpen = false;
            state.ledger.locked = false;
            state.ledger.unlocked = false;
            state.ledger.busy = false;
            state.ledger.replug = false;
        },
        lock(state) {
            state.ledger.locked = true;
            state.ledger.unlocked = false;
            state.ledger.userImportFailure = true;
        },
        unlock(state) {
            state.ledger.locked = false;
            state.ledger.unlocked = true;
        },
        filecoinAppNotOpen(state) {
            state.ledger.filecoinAppNotOpen = true;
            state.ledger.userImportFailure = true;
            state.ledger.unlocked = true;
        },
        filecoinAppOpen(state, action: PayloadAction<Filecoin>) {
            state.ledger.filecoinAppNotOpen = false;
            state.ledger.locked = false;
            state.ledger.unlocked = true;
            state.ledger.replug = false;
            state.ledger.busy = false;
            state.walletProvider = action.payload;
        },
        busy(state) {
            state.ledger.busy = true;
        },
        replug(state) {
            state.ledger.replug = true;
        },
        usedByAnotherApp(state) {
            state.ledger.inUseByAnotherApp = true;
        },
        ledgerBadVersion(state) {
            state.ledger.badVersion = true;
        },
        webUsbUnsupported(state) {
            state.ledger.webUSBSupported = true;
        },
    },
});

export default ledgerSlice;
