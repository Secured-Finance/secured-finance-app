import { create } from 'zustand';
import { LastErrorStore, defaultLastErrorStore } from './types';

type LastErrorState = LastErrorStore;

type LastErrorActions = {
    setLastMessage: (message: string) => void;
    setMessage: (message: string) => void; // Alias for setLastMessage for backward compatibility
    clearLastMessage: () => void;
};

type LastErrorStoreWithActions = LastErrorState & LastErrorActions;

export const useLastErrorStore = create<LastErrorStoreWithActions>(set => ({
    ...defaultLastErrorStore,
    setLastMessage: message => set({ lastMessage: message }),
    setMessage: message => set({ lastMessage: message }), // Alias for backward compatibility
    clearLastMessage: () => set({ lastMessage: null }),
}));
