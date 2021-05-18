import { updateFilWalletUSDBalance } from './actions';
import { RootState } from '../types';
import { Coin } from './types';
import { getAssetPrices } from './selectors';
import { BigNumber, FilecoinNumber } from '@glif/filecoin-number';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

export const calculateUSDBalance = (coin: Coin, balance: FilecoinNumber) => {
    return (
        dispatch: ThunkDispatch<RootState, void, Action>,
        getState: () => RootState
    ) => {
        const price: number = getAssetPrices(getState())[coin].price;
        const usdBalance: number = new BigNumber(balance.toFil())
            .times(new BigNumber(price))
            .toNumber();
        dispatch(updateFilWalletUSDBalance(usdBalance));
    };
};
