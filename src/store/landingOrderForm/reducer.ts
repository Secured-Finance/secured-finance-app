import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { ViewType } from 'src/components/atoms';
import { OrderType } from 'src/types';
import { CurrencySymbol } from 'src/utils';

type LandingOrderFormStore = {
    currency: CurrencySymbol;
    maturity: number;
    side: OrderSide;
    amount: string;
    unitPrice: string | undefined;
    orderType: OrderType;
    lastView: ViewType;
    sourceAccount: WalletSource;
    isBorrowedCollateral: boolean;
};

const initialStore: LandingOrderFormStore = {
    currency: CurrencySymbol.USDC,
    maturity: 0,
    side: OrderSide.LEND,
    amount: '',
    unitPrice: undefined,
    orderType: OrderType.MARKET,
    lastView: 'Advanced',
    sourceAccount: WalletSource.SF_VAULT,
    isBorrowedCollateral: false,
};

const landingOrderFormSlice = createSlice({
    name: 'landingOrderForm',
    initialState: initialStore,
    reducers: {
        setCurrency: (state, action: PayloadAction<CurrencySymbol>) => {
            state.currency = action.payload;
        },
        setMaturity: (state, action: PayloadAction<number>) => {
            state.maturity = action.payload;
        },
        setSide: (state, action: PayloadAction<OrderSide>) => {
            state.side = action.payload;
        },
        setAmount: (state, action: PayloadAction<string>) => {
            state.amount = action.payload;
        },
        setUnitPrice: (state, action: PayloadAction<string | undefined>) => {
            state.unitPrice = action.payload;
        },
        resetUnitPrice: state => {
            state.unitPrice = undefined;
        },
        resetAmount: state => {
            state.amount = '';
        },
        setOrderType: (state, action: PayloadAction<OrderType>) => {
            state.orderType = action.payload;
        },
        setLastView: (state, action: PayloadAction<ViewType>) => {
            state.lastView = action.payload;
        },
        setSourceAccount: (state, action: PayloadAction<WalletSource>) => {
            state.sourceAccount = action.payload;
        },
        setIsBorrowedCollateral: (state, action: PayloadAction<boolean>) => {
            state.isBorrowedCollateral = action.payload;
        },
    },
});

export const selectLandingOrderForm = (state: LandingOrderFormStore) => {
    return {
        ...state,
        amount: BigInt(state.amount),
        unitPrice: state.unitPrice ? Number(state.unitPrice) : undefined,
        amountExists: state.amount !== '',
        unitPriceExists: state.unitPrice !== '',
    };
};

export default landingOrderFormSlice;
