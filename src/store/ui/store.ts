import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { DEFAULT_UI_STATE, UIState } from './types';

interface UIActions {
    setWalletDialogOpen: (open: boolean) => void;
    resetStore: () => void;
}

type UIStoreWithActions = UIState & UIActions;

export const useUIStore = create<UIStoreWithActions>()(
    subscribeWithSelector((set, _get) => ({
        ...DEFAULT_UI_STATE,
        setWalletDialogOpen: (open: boolean) => set({ walletDialogOpen: open }),
        resetStore: () => set(DEFAULT_UI_STATE),
    }))
);
