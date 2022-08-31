import { configureStore } from '@reduxjs/toolkit';
import filWalletProvider from '../services/filecoin/store';
import assetPrices from './assetPrices';
import blockchain from './blockchain';
import { listenerMiddleware } from './blockchain/reducer';
import history from './history';
import landingOrderForm from './landingOrderForm';
import lastError from './lastError';
import ledger from './ledger';
import lendingTerminal from './lendingTerminal';
import wallets from './wallets';

export const rootReducers = {
    history,
    wallets,
    assetPrices,
    filWalletProvider,
    lendingTerminal,
    ledger,
    blockchain,
    lastError,
    landingOrderForm,
};

const store = configureStore({
    reducer: rootReducers,
    // This setting reproduce the behavior without redux-toolkit.
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).prepend(listenerMiddleware.middleware),
});
export default store;
export type AppDispatch = typeof store.dispatch;
