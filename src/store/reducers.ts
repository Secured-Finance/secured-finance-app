import { combineReducers } from 'redux';
import rates from './rates';
import history from './history';
import lending from './lending';
import wallets from './wallets';
import assetPrices from './assetPrices';
import filWalletProvider from '../services/filecoin/store';
import sendForm from './sendForm';
import collateralForm from './collateralForm';

const rootReducer = combineReducers({
    rates,
    history,
    lending,
    wallets,
    assetPrices,
    filWalletProvider,
    sendForm,
    collateralForm,
});

export default rootReducer