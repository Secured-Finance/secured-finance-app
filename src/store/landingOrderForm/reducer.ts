import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Currency, Term } from 'src/utils';

type LandingOrderFormStore = {
    currency: Currency;
    term: Term;
    side: number;
    amount: number;
    rate: number;
};
const initialStore: LandingOrderFormStore = {
    currency: Currency.FIL,
    term: Term['3M'],
    side: 0,
    amount: 0,
    rate: 0,
};

const landingOrderFormSlice = createSlice({
    name: 'landingOrderForm',
    initialState: initialStore,
    reducers: {
        setCurrency: (state, action: PayloadAction<Currency>) => {
            state.currency = action.payload;
        },
        setTerm: (state, action: PayloadAction<Term>) => {
            state.term = action.payload;
        },
        setSide: (state, action: PayloadAction<number>) => {
            state.side = action.payload;
        },
        setAmount: (state, action: PayloadAction<number>) => {
            state.amount = action.payload;
        },
        setRate: (state, action: PayloadAction<number>) => {
            state.rate = action.payload;
        },
    },
});

export default landingOrderFormSlice;
