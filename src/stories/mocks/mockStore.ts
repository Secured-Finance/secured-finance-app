import { configureStore } from '@reduxjs/toolkit';
import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import store, { rootReducers } from 'src/store';
import { OrderType } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import { dec22Fixture } from './fixtures';

export const initialStore = {
    ...store.getState(),
    blockchain: {
        ...store.getState().blockchain,
        chainId: 11155111,
        chainError: false,
        testnetEnabled: true,
        isChainIdDetected: true,
    },
    landingOrderForm: {
        currency: CurrencySymbol.WFIL,
        maturity: dec22Fixture.toNumber(),
        side: OrderSide.BORROW,
        amount: '',
        unitPrice: undefined,
        orderType: OrderType.MARKET,
        lastView: 'Simple' as const,
        sourceAccount: WalletSource.SF_VAULT,
        isBorrowedCollateral: false,
    },
};

export const mockStore = configureStore({
    reducer: rootReducers,
    preloadedState: initialStore,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
