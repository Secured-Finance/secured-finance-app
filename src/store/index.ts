import { configureStore } from '@reduxjs/toolkit';
import analytics from './analytics';
import assetPrices from './assetPrices';
import blockchain from './blockchain';
import { listenerMiddleware } from './blockchain/reducer';
import interactions from './interactions';
import landingOrderForm from './landingOrderForm';
import lastError from './lastError';
import wallet from './wallet';

export const rootReducers = {
    analytics,
    assetPrices,
    blockchain,
    interactions,
    landingOrderForm,
    lastError,
    wallet,
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
