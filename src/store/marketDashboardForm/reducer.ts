import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';
import { OrderSide, OrderType } from 'src/hooks';
import { CurrencySymbol } from 'src/utils';

type MarketDashboardFormStore = {
    currency: CurrencySymbol;
    maturity: string;
    side: OrderSide;
    amount: string;
    rate: number;
    orderType: OrderType;
};
const initialStore: MarketDashboardFormStore = {
    currency: CurrencySymbol.FIL,
    maturity: '0',
    side: OrderSide.Borrow,
    amount: '0',
    rate: 0,
    orderType: OrderType.MARKET,
};

const marketDashboardFormSlice = createSlice({
    name: 'marketDashboardForm',
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
        setOrderType: (state, action: PayloadAction<OrderType>) => {
            state.orderType = action.payload;
        },
    },
});

export const selectMarketDashboardForm = (state: MarketDashboardFormStore) => {
    return {
        ...state,
        amount: BigNumber.from(state.amount),
    };
};

export default marketDashboardFormSlice;
