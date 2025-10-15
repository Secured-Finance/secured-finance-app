import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { DEFAULT_UI_STATE, UIState } from './types';

interface UIActions {
    setWalletDialogOpen: (open: boolean) => void;
    resetStore: () => void;
    clearPersisted: () => void;
    hasPersisted: () => boolean;
}

type UIStoreWithActions = UIState & UIActions;

export const useUIStore = create<UIStoreWithActions>()(
    devtools(
        persist(
            subscribeWithSelector(set => ({
                ...DEFAULT_UI_STATE,

                clearPersisted: () => {
                    localStorage.removeItem('ui-settings');
                },
                hasPersisted: () => {
                    return localStorage.getItem('ui-settings') !== null;
                },

                setWalletDialogOpen: (open: boolean) =>
                    set({ walletDialogOpen: open }),
                resetStore: () => set(DEFAULT_UI_STATE),
            })),
            {
                name: 'ui-settings',
                partialize: state => ({
                    walletDialogOpen: state.walletDialogOpen,
                }),
            }
        ),
        { name: 'UIStore' }
    )
);
