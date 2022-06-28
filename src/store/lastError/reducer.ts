import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialStore: {
    lastMessage: string | null;
} = {
    lastMessage: null,
};

export const errorSlice = createSlice({
    name: 'lastError',
    initialState: initialStore,
    reducers: {
        setLastMessage: (state, action: PayloadAction<string>) => {
            state.lastMessage = action.payload;
        },
        clearLastMessage: state => {
            state.lastMessage = null;
        },
    },
});
