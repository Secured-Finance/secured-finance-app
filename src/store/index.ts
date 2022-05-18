import { configureStore } from '@reduxjs/toolkit';
import filWalletProvider from '../services/filecoin/store';
import assetPrices from './assetPrices';
import collateralForm from './collateralForm';
import historyReducer from './history';
import ledger from './ledger';
import lending from './lending';
import lendingTerminal from './lendingTerminal';
import rates from './rates';
import sendForm from './sendForm';
import wallets from './wallets';

export const rootReducers = {
    history: historyReducer,
    rates,
    lending,
    wallets,
    assetPrices,
    filWalletProvider,
    sendForm,
    collateralForm,
    lendingTerminal,
    ledger,
};

const store = configureStore({
    reducer: {
        history: historyReducer,
        rates,
        lending,
        wallets,
        assetPrices,
        filWalletProvider,
        sendForm,
        collateralForm,
        lendingTerminal,
        ledger,
    },
    // This setting reproduce the behavior without redux-toolkit.
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
export default store;
export type AppDispatch = typeof store.dispatch;
