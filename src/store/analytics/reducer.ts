import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Analytics = {
    midPrice: number;
};
const initialState: Analytics = {
    midPrice: 0,
};

export const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        setMidPrice: (state, action: PayloadAction<number>) => {
            state.midPrice = action.payload;
        },
    },
});
