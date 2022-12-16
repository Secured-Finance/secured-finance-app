import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Side } from '@secured-finance/sf-client/dist/secured-finance-client';
import { BigNumber } from 'ethers';
import { OrderType } from 'src/hooks';
import { CurrencySymbol } from 'src/utils';
import { Maturity } from 'src/utils/entities';

type LandingOrderFormStore = {
    currency: CurrencySymbol;
    maturity: number;
    side: Side;
    amount: string;
    unitPrice: number;
    orderType: OrderType;
};
const initialStore: LandingOrderFormStore = {
    currency: CurrencySymbol.FIL,
    maturity: 0,
    side: Side.BORROW,
    amount: '0',
    unitPrice: 0,
    orderType: OrderType.MARKET,
};

const landingOrderFormSlice = createSlice({
    name: 'landingOrderForm',
    initialState: initialStore,
    reducers: {
        setCurrency: (state, action: PayloadAction<CurrencySymbol>) => {
            state.currency = action.payload;
        },
        setMaturity: (state, action: PayloadAction<Maturity>) => {
            state.maturity = action.payload.toNumber();
        },
        setSide: (state, action: PayloadAction<Side>) => {
            state.side = action.payload;
        },
        setAmount: (state, action: PayloadAction<BigNumber>) => {
            state.amount = action.payload.toString();
        },
        setUnitPrice: (state, action: PayloadAction<number>) => {
            state.unitPrice = action.payload;
        },
        setOrderType: (state, action: PayloadAction<OrderType>) => {
            state.orderType = action.payload;
        },
    },
});

export const selectLandingOrderForm = (state: LandingOrderFormStore) => {
    return {
        ...state,
        maturity: new Maturity(state.maturity),
        amount: BigNumber.from(state.amount),
    };
};

export default landingOrderFormSlice;
