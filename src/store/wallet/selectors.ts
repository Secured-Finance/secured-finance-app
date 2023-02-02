import { currencyMap, CurrencySymbol } from 'src/utils';
import { RootState } from '../types';
import { WalletsStore } from './types';

export const isEthereumWalletConnected = (state: RootState) => {
    return !!state.wallet.address;
};

export const selectAllBalances = (state: RootState) => {
    return state.wallet.balances;
};

export const selectCollateralCurrencyBalance = (state: RootState) => {
    const result: Partial<WalletsStore['balances']> = {};
    const keys = Object.keys(state.wallet.balances) as CurrencySymbol[];
    keys.forEach(key => {
        if (currencyMap[key].isCollateral) {
            result[key] = state.wallet.balances[key];
        }
    });
    return result;
};
