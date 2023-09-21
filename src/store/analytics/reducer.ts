import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Analytics = {
    marketPrice: number;
};
const initialState: Analytics = {
    marketPrice: 0,
};

export const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        setMarketPrice: (state, action: PayloadAction<number>) => {
            state.marketPrice = action.payload;
        },
    },
});
