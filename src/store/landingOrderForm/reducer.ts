import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderSide } from '@secured-finance/sf-client';
import { BigNumber } from 'ethers';
import { ViewType } from 'src/components/atoms';
import { OrderType } from 'src/hooks';
import { CurrencySymbol } from 'src/utils';
import { Maturity } from 'src/utils/entities';

type LandingOrderFormStore = {
    currency: CurrencySymbol;
    maturity: number;
    side: OrderSide;
    amount: string;
    unitPrice: number;
    orderType: OrderType;
    lastView: ViewType;
};
const initialStore: LandingOrderFormStore = {
    currency: CurrencySymbol.EFIL,
    maturity: 0,
    side: OrderSide.BORROW,
    amount: '0',
    unitPrice: 0,
    orderType: OrderType.MARKET,
    lastView: 'Simple',
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
        setSide: (state, action: PayloadAction<OrderSide>) => {
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
        setLastView: (state, action: PayloadAction<ViewType>) => {
            state.lastView = action.payload;
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
