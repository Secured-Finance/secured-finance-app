export interface ErrorState {
    message: string | null;
    timestamp?: number;
}

export const DEFAULT_ERROR_STATE: ErrorState = {
    message: null,
    timestamp: undefined,
};

// Legacy export for backward compatibility - will be removed in future version
export interface LastErrorStore {
    lastMessage: string | null;
}

export const defaultLastErrorStore: LastErrorStore = {
    lastMessage: null,
};
