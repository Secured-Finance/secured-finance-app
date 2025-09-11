import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { DEFAULT_WALLET_STATE, WalletState } from './types';

interface WalletActions {
    setAddress: (address: string) => void;
    setBalance: (balance: string) => void;
    resetStore: () => void;
    connectWallet: (address: string) => void;
    updateBalance: (balance: string) => void;
    resetWallet: () => void;
}

type WalletStoreWithActions = WalletState & WalletActions;

export const useWalletStore = create<WalletStoreWithActions>()(
    subscribeWithSelector((set, _get) => ({
        ...DEFAULT_WALLET_STATE,
        setAddress: (address: string) => set({ address }),
        setBalance: (balance: string) => set({ balance }),

        resetStore: () => set(DEFAULT_WALLET_STATE),

        connectWallet: (address: string) => set({ address }),
        updateBalance: (balance: string) => set({ balance }),
        resetWallet: () => set(DEFAULT_WALLET_STATE),
    }))
);
