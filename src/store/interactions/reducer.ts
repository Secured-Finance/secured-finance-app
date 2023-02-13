import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Interactions = {
    walletDialogOpen: boolean;
};

const initialState: Interactions = {
    walletDialogOpen: false,
};

export const interactionsSlice = createSlice({
    name: 'interactions',
    initialState,
    reducers: {
        setWalletDialogOpen: (state, action: PayloadAction<boolean>) => {
            state.walletDialogOpen = action.payload;
        },
    },
});
