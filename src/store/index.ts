import { configureStore } from '@reduxjs/toolkit';
import blockchain from './blockchain';
import landingOrderForm from './landingOrderForm';
import lastError from './lastError';
import wallet from './wallet';

export const rootReducers = {
    blockchain,
    landingOrderForm,
    lastError,
    wallet,
};

const store = configureStore({
    reducer: rootReducers,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['landingOrderForm/setAmount'],
            },
        }),
});
export default store;
export type AppDispatch = typeof store.dispatch;
