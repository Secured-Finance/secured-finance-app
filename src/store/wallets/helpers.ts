import { updateTotalUSDBalance } from './actions';
import { RootState } from '../types';
import { Coin } from './types';
import { getAssetPrices, getTotalUSDBalance } from './selectors';
import { BigNumber, FilecoinNumber } from '@glif/filecoin-number';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

export const calculateUSDBalance = (coin: Coin, balance: FilecoinNumber) => {
    return (
        dispatch: ThunkDispatch<RootState, void, Action>,
        getState: () => RootState
    ) => {
        const price: number = getAssetPrices(getState())[coin].price;
        return new BigNumber(balance.toFil())
            .times(new BigNumber(price))
            .toNumber();
    };
};

export const recalculateTotalUSDBalance = (amount: number = 0) => {
    return (
        dispatch: ThunkDispatch<RootState, void, Action>,
        getState: () => RootState
    ) => {
        const currentTotalUSDBalance = getTotalUSDBalance(getState());
        dispatch(updateTotalUSDBalance(currentTotalUSDBalance + amount));
    };
};
