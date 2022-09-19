import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';
import { OrderSide } from 'src/hooks';
import { CurrencySymbol } from 'src/utils';

type LandingOrderFormStore = {
    currency: CurrencySymbol;
    maturity: string;
    side: OrderSide;
    amount: string;
    rate: number;
};
const initialStore: LandingOrderFormStore = {
    currency: CurrencySymbol.FIL,
    maturity: '0',
    side: OrderSide.Borrow,
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
        setMaturity: (state, action: PayloadAction<string>) => {
            state.maturity = action.payload;
        },
        setSide: (state, action: PayloadAction<OrderSide>) => {
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
