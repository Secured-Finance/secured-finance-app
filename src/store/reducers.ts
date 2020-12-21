import { combineReducers } from 'redux';
import rates from './rates';
import history from './history';
import lending from './lending';
import wallets from './wallets';
import assetPrices from './assetPrices';

const rootReducer = combineReducers({
    rates,
    history,
    lending,
    wallets,
    assetPrices,
});

export default rootReducer