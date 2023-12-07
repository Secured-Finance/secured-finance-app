import { configureStore } from '@reduxjs/toolkit';
import blockchain from './blockchain';
import interactions from './interactions';
import landingOrderForm from './landingOrderForm';
import lastError from './lastError';
import wallet from './wallet';

export const rootReducers = {
    blockchain,
    interactions,
    landingOrderForm,
    lastError,
    wallet,
};

const store = configureStore({
    reducer: rootReducers,
});
export default store;
export type AppDispatch = typeof store.dispatch;
