import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
    DEFAULT_ERROR_STATE,
    ErrorState,
    LastErrorStore,
    defaultLastErrorStore,
} from './types';

interface ErrorActions {
    setError: (message: string) => void;
    setMessage: (message: string) => void;
    clearError: () => void;
    resetStore: () => void;
}

type ErrorStoreWithActions = ErrorState & LastErrorStore & ErrorActions;

export const useLastErrorStore = create<ErrorStoreWithActions>()(
    subscribeWithSelector((set, _get) => ({
        ...DEFAULT_ERROR_STATE,
        lastMessage: defaultLastErrorStore.lastMessage,

        setError: (message: string) =>
            set({
                message,
                timestamp: Date.now(),
                lastMessage: message,
            }),
        setMessage: (message: string) =>
            set({
                message,
                timestamp: Date.now(),
                lastMessage: message,
            }),
        clearError: () =>
            set({
                message: null,
                timestamp: undefined,
                lastMessage: defaultLastErrorStore.lastMessage,
            }),

        resetStore: () =>
            set({
                ...DEFAULT_ERROR_STATE,
                lastMessage: defaultLastErrorStore.lastMessage,
            }),
    }))
);
