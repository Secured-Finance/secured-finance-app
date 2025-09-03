export interface LastErrorStore {
    lastMessage: string | null;
}

export const defaultLastErrorStore: LastErrorStore = {
    lastMessage: null,
};
