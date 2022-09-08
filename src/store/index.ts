import { configureStore } from '@reduxjs/toolkit';
import assetPrices from './assetPrices';
import blockchain from './blockchain';
import { listenerMiddleware } from './blockchain/reducer';
import ethereumWallet from './ethereumWallet';
import history from './history';
import landingOrderForm from './landingOrderForm';
import lastError from './lastError';
import lendingTerminal from './lendingTerminal';

export const rootReducers = {
    history,
    ethereumWallet,
    assetPrices,
    lendingTerminal,
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
