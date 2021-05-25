import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from 'use-wallet';
import WalletAccountModal from '../components/WalletAccountModal';
import { RootState } from '../store/types';
import {
    updateEthWalletActions,
    updateEthWalletAddress,
    updateEthWalletAssetPrice,
    updateEthWalletBalance,
    updateEthWalletDailyChange,
    updateEthWalletPortfolioShare,
    updateEthWalletUSDBalance,
    resetEthWallet,
} from '../store/wallets';
import { useEthereumUsd } from './useAssetPrices';

import useBlock from './useBlock';
import useModal from './useModal';

export const useEthereumWalletStore = () => {
    const ethWallet = useSelector((state: RootState) => {
        return state.wallets.ethereum;
    });
    const block = useBlock();
    const dispatch = useDispatch();
    const { account, balance, reset } = useWallet();
    const { price, change } = useEthereumUsd();
    const totalUSDBalance = useSelector(
        (state: RootState) => state.wallets.totalUSDBalance
    );
    const [onPresentAccountModal] = useModal(WalletAccountModal);

    const actObj = {
        send: onPresentAccountModal,
        placeCollateral: onPresentAccountModal,
        signOut: reset,
    };

    const fetchEthStore = useCallback(
        async (isMounted: boolean) => {
            const inEther = new BigNumber(balance)
                .dividedBy(new BigNumber(10).pow(18))
                .toNumber();
            const usdBalance = new BigNumber(inEther)
                .times(new BigNumber(price))
                .toNumber();
            const portfolioShare = new BigNumber(usdBalance)
                .times(100)
                .dividedBy(new BigNumber(totalUSDBalance))
                .toNumber();

            dispatch(updateEthWalletAddress(account));
            dispatch(updateEthWalletBalance(inEther));
            dispatch(updateEthWalletAssetPrice(price));
            dispatch(updateEthWalletDailyChange(change));
            dispatch(updateEthWalletUSDBalance(usdBalance));
            if (portfolioShare != (null || Infinity)) {
                dispatch(updateEthWalletPortfolioShare(portfolioShare));
            }
            dispatch(updateEthWalletActions(actObj));
        },
        [dispatch, account, balance, reset, totalUSDBalance, price, change]
    );

    useEffect(() => {
        let isMounted = true;
        if (
            account &&
            balance &&
            reset &&
            totalUSDBalance != 0 &&
            price != 0 &&
            change != 0
        ) {
            fetchEthStore(isMounted);
        }

        return () => {
            isMounted = false;
        };
    }, [
        block,
        dispatch,
        account,
        balance,
        reset,
        totalUSDBalance,
        price,
        change,
    ]);

    useEffect(() => {
        if (account === null) {
            dispatch(resetEthWallet());
        }
    }, [account]);

    return ethWallet;
};

export const useEthBalance = () => {
    const { account, balance } = useWallet();
    const dispatch = useDispatch();
    const ethBalance = useSelector(
        (state: RootState) => state.wallets.ethereum.balance
    );

    const fetchEthStore = useCallback(
        async (isMounted: boolean) => {
            const inEther = new BigNumber(balance)
                .dividedBy(new BigNumber(10).pow(18))
                .toNumber();
            dispatch(updateEthWalletBalance(inEther));
        },
        [dispatch, account, balance]
    );

    useEffect(() => {
        let isMounted = true;
        if (account && balance) {
            fetchEthStore(isMounted);
        }
        return () => {
            isMounted = false;
        };
    }, [dispatch, account, balance]);

    return ethBalance;
};
