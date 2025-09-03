import { create } from 'zustand';
import { WalletStore, defaultWalletStore } from './types';

type WalletState = WalletStore;

type WalletActions = {
    connectWallet: (address: string) => void;
    updateBalance: (balance: string) => void;
    resetWallet: () => void;
};

type WalletStoreWithActions = WalletState & WalletActions;

export const useWalletStore = create<WalletStoreWithActions>(set => ({
    ...defaultWalletStore,
    connectWallet: address => set({ address }),
    updateBalance: balance => set({ balance }),
    resetWallet: () => set(defaultWalletStore),
}));
