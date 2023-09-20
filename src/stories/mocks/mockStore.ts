import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import store, { rootReducers } from 'src/store';
import landingOrderForm from 'src/store/landingOrderForm';
import { OrderType } from 'src/types';
import { CurrencySymbol } from 'src/utils';

export const initialStore = {
    ...store.getState(),
    landingOrderForm: {
        currency: CurrencySymbol.WFIL,
        maturity: 0,
        side: OrderSide.BORROW,
        amount: '0',
        unitPrice: undefined,
        orderType: OrderType.MARKET,
        lastView: 'Simple' as const,
        sourceAccount: WalletSource.METAMASK,
        isBorrowedCollateral: false,
    },
};

export const newReducer = combineReducers({
    ...rootReducers,
    lendingForm: landingOrderForm,
});

export const mockStore = configureStore({
    reducer: rootReducers,
    preloadedState: initialStore,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
