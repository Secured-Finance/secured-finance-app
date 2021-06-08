import { RootState } from '../types';

export const getLedger = (state: RootState) => state.ledger;

export const isUsedByAnotherApp = (state: RootState) => {
    const ledger = getLedger(state).ledger;
    return ledger.inUseByAnotherApp;
};

export const getLedgerProvider = (state: RootState) =>
    getLedger(state).walletProvider;

export const isDeviceUnlocked = (state: RootState) =>
    getLedger(state).ledger.unlocked;
