import { create } from 'zustand';

type UIState = {
    walletDialogOpen: boolean;
};

type UIActions = {
    setWalletDialogOpen: (open: boolean) => void;
};

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>(set => ({
    walletDialogOpen: false,
    setWalletDialogOpen: open => set({ walletDialogOpen: open }),
}));
