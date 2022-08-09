import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';
import { CurrencySymbol, Term } from 'src/utils';

type LandingOrderFormStore = {
    currency: CurrencySymbol;
    term: Term;
    side: number;
    amount: string;
    rate: number;
};
const initialStore: LandingOrderFormStore = {
    currency: CurrencySymbol.FIL,
    term: Term['3M'],
    side: 0,
    amount: '0',
    rate: 0,
};

const landingOrderFormSlice = createSlice({
    name: 'landingOrderForm',
    initialState: initialStore,
    reducers: {
        setCurrency: (state, action: PayloadAction<CurrencySymbol>) => {
            state.currency = action.payload;
        },
        setTerm: (state, action: PayloadAction<Term>) => {
            state.term = action.payload;
        },
        setSide: (state, action: PayloadAction<number>) => {
            state.side = action.payload;
        },
        setAmount: (state, action: PayloadAction<BigNumber>) => {
            state.amount = action.payload.toString();
        },
        setRate: (state, action: PayloadAction<number>) => {
            state.rate = action.payload;
        },
    },
});

export const selectLandingOrderForm = (state: LandingOrderFormStore) => {
    return {
        ...state,
        amount: BigNumber.from(state.amount),
    };
};

export default landingOrderFormSlice;
