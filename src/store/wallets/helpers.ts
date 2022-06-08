import { BigNumber, FilecoinNumber } from '@glif/filecoin-number';
import LotusRpcEngine from '@glif/filecoin-rpc-client';
import Filecoin from '@glif/filecoin-wallet-provider';
import { Action, Dispatch } from 'redux';
import {
    FIL_JSON_RPC_ENDPOINT,
    getFilecoinNetwork,
} from 'src/services/filecoin';
import {
    updateFilWalletAddress,
    updateFilWalletBalance,
    updateFilWalletPortfolioShare,
    updateFilWalletUSDBalance,
    updateTotalUSDBalance,
} from '.';
import { AppDispatch } from '..';
import { RootState } from '../types';
import {
    getAssetPrices,
    getEthUSDBalance,
    getFilUSDBalance,
    getTotalUSDBalance,
} from './selectors';
import { Coin } from './types';

export const calculateUSDBalance = (coin: Coin, balance: FilecoinNumber) => {
    return (getState: () => RootState) => {
        const price: number = getAssetPrices(getState())[coin].price;
        return new BigNumber(balance.toFil())
            .times(new BigNumber(price))
            .toNumber();
    };
};

export const recalculateTotalUSDBalance = () => {
    return (dispatch: Dispatch<Action>, getState: () => RootState) => {
        const state = getState();
        const ethUsdBalance = getEthUSDBalance(state);
        const filUsdBalance = getFilUSDBalance(state);
        const sum = ethUsdBalance + filUsdBalance;
        dispatch(updateTotalUSDBalance(sum));
    };
};

export const updateFilWalletViaProvider = (
    walletProvider: Filecoin,
    filAddr: string
) => {
    return async (dispatch: AppDispatch) => {
        if (filAddr) {
            const balance = await walletProvider.getBalance(filAddr);

            dispatch(updateFilWallet(balance, filAddr));
        }
    };
};

export const updateFilWalletViaRPC = (filAddr: string) => {
    return async (dispatch: AppDispatch) => {
        const lotusRPC = new LotusRpcEngine({
            apiAddress: FIL_JSON_RPC_ENDPOINT[getFilecoinNetwork()],
        });

        const chainHead = await lotusRPC.request('WalletBalance', filAddr);
        const balance = new FilecoinNumber(chainHead, 'attofil');
        dispatch(updateFilWallet(balance, filAddr));
    };
};

export const updateFilWallet = (balance: FilecoinNumber, filAddr: string) => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const state = getState();
        dispatch(recalculateTotalUSDBalance());
        const totalUSDBalance = getTotalUSDBalance(state);
        const usdBalance: number = calculateUSDBalance(
            'filecoin',
            balance
        )(getState);
        const portfolioShare =
            totalUSDBalance === 0
                ? 0
                : new BigNumber(usdBalance)
                      .times(100)
                      .dividedBy(new BigNumber(totalUSDBalance))
                      .toNumber();

        dispatch(updateFilWalletAddress(filAddr));
        dispatch(updateFilWalletBalance(balance.toNumber()));
        dispatch(updateFilWalletUSDBalance(usdBalance));
        dispatch(updateFilWalletPortfolioShare(portfolioShare));
    };
};
