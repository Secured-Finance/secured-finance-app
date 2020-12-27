import { combineReducers } from 'redux';
import rates from './rates';
import history from './history';
import lending from './lending';
import wallets from './wallets';
import assetPrices from './assetPrices';
import filWalletProvider from '../services/filecoin/store';

const rootReducer = combineReducers({
    rates,
    history,
    lending,
    wallets,
    assetPrices,
    filWalletProvider,
});

export default rootReducer