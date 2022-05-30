import { configureStore } from '@reduxjs/toolkit';
import filWalletProvider from '../services/filecoin/store';
import assetPrices from './assetPrices';
import blockchain from './blockchain';
import { listenerMiddleware } from './blockchain/reducer';
import collateralForm from './collateralForm';
import history from './history';
import ledger from './ledger';
import lending from './lending';
import lendingTerminal from './lendingTerminal';
import rates from './rates';
import sendForm from './sendForm';
import transaction from './transaction';
import wallets from './wallets';

export const rootReducers = {
    history,
    rates,
    lending,
    wallets,
    assetPrices,
    filWalletProvider,
    sendForm,
    collateralForm,
    lendingTerminal,
    ledger,
    blockchain,
    transaction,
};

const store = configureStore({
    reducer: {
        history,
        rates,
        lending,
        wallets,
        assetPrices,
        filWalletProvider,
        sendForm,
        collateralForm,
        lendingTerminal,
        ledger,
        blockchain,
        transaction,
    },
    // This setting reproduce the behavior without redux-toolkit.
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).prepend(listenerMiddleware.middleware),
});
export default store;
export type AppDispatch = typeof store.dispatch;
