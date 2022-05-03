import { BigNumber, FilecoinNumber } from '@glif/filecoin-number';
import LotusRpcEngine from '@glif/filecoin-rpc-client';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { FILSCAN_API_URL, getFilecoinNetwork } from 'src/services/filecoin';
import { RootState } from '../types';
import {
    updateFilWalletAddress,
    updateFilWalletBalance,
    updateFilWalletPortfolioShare,
    updateFilWalletUSDBalance,
    updateTotalUSDBalance,
} from './actions';
import {
    getAssetPrices,
    getEthUSDBalance,
    getFilUSDBalance,
    getTotalUSDBalance,
} from './selectors';
import { Coin } from './types';

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

export const recalculateTotalUSDBalance = () => {
    return (
        dispatch: ThunkDispatch<RootState, void, Action>,
        getState: () => RootState
    ) => {
        const state = getState();
        const ethUsdBalance = getEthUSDBalance(state);
        const filUsdBalance = getFilUSDBalance(state);
        const sum = ethUsdBalance + filUsdBalance;
        dispatch(updateTotalUSDBalance(sum));
    };
};

export const updateFilWalletViaProvider = (
    walletProvider: any,
    filAddr: string
) => {
    return async (dispatch: ThunkDispatch<RootState, void, Action>) => {
        if (filAddr) {
            const balance = await walletProvider.getBalance(filAddr);

            dispatch(updateFilWallet(balance, filAddr));
        }
    };
};

export const updateFilWalletViaRPC = (filAddr: string) => {
    return async (dispatch: ThunkDispatch<RootState, void, Action>) => {
        const lotusRPC = new LotusRpcEngine({
            apiAddress: FILSCAN_API_URL[getFilecoinNetwork()],
        });
        const chainHead = await lotusRPC.request('WalletBalance', filAddr);
        const balance = new FilecoinNumber(chainHead, 'attofil');
        dispatch(updateFilWallet(balance, filAddr));
    };
};

export const updateFilWallet = (balance: FilecoinNumber, filAddr: string) => {
    return (
        dispatch: ThunkDispatch<RootState, void, Action>,
        getState: () => RootState
    ) => {
        const state = getState();
        const totalUSDBalance = getTotalUSDBalance(state);
        const usdBalance: number = dispatch(
            calculateUSDBalance('filecoin', balance)
        );
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
        dispatch(recalculateTotalUSDBalance());
    };
};
