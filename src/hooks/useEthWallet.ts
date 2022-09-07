import BigNumber from 'bignumber.js';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import {
    connectEthWallet,
    resetEthWallet,
    updateEthWalletAssetPrice,
    updateEthWalletBalance,
    updateEthWalletDailyChange,
    updateEthWalletPortfolioShare,
    updateEthWalletUSDBalance,
} from 'src/store/wallets';
import { useWallet } from 'use-wallet';

export const useEthereumWalletStore = () => {
    const dispatch = useDispatch();
    const { account, balance, status } = useWallet();
    const { price, change } = useSelector(
        (state: RootState) => state.assetPrices.ethereum
    );
    const { totalUSDBalance, ethereum: ethWallet } = useSelector(
        (state: RootState) => state.wallets
    );

    const getWalletBalance = useCallback(
        (balance: number | string, price: number) => {
            if (!account) return { usdBalance: 0, inEther: 0 };

            const inEther = new BigNumber(balance)
                .dividedBy(new BigNumber(10).pow(18))
                .toNumber();
            const usdBalance = new BigNumber(inEther)
                .times(new BigNumber(price))
                .toNumber();
            return { usdBalance, inEther };
        },
        [account]
    );

    const fetchEthStore = useCallback(
        async (account: string) => {
            const { usdBalance, inEther } = getWalletBalance(balance, price);
            const portfolioShare = new BigNumber(usdBalance)
                .times(100)
                .dividedBy(new BigNumber(totalUSDBalance))
                .toNumber();

            dispatch(connectEthWallet(account));
            dispatch(updateEthWalletBalance(inEther));
            dispatch(updateEthWalletAssetPrice(price));
            dispatch(updateEthWalletDailyChange(change));
            dispatch(updateEthWalletUSDBalance(usdBalance));

            if (
                !Number.isNaN(portfolioShare) &&
                portfolioShare !== (null || Infinity)
            ) {
                dispatch(updateEthWalletPortfolioShare(portfolioShare));
            }
        },
        [getWalletBalance, balance, price, totalUSDBalance, dispatch, change]
    );

    const connectWallet = useCallback(
        (account: string) => {
            dispatch(connectEthWallet(account));
        },
        [dispatch]
    );

    useEffect(() => {
        if (status === 'connected' && account) {
            connectWallet(account);
        }
    }, [status, connectWallet, account]);

    useEffect(() => {
        if (account) {
            fetchEthStore(account);
        }
    }, [account, balance, change, fetchEthStore, price, totalUSDBalance]);

    useEffect(() => {
        if (account === null) {
            dispatch(resetEthWallet());
        }
    }, [account, dispatch]);

    return ethWallet;
};

export const useEthBalance = () => {
    const { account, balance } = useWallet();
    const dispatch = useDispatch();
    const ethBalance = useSelector(
        (state: RootState) => state.wallets.ethereum.balance
    );

    const fetchEthStore = useCallback(async () => {
        const inEther = new BigNumber(balance)
            .dividedBy(new BigNumber(10).pow(18))
            .toNumber();
        dispatch(updateEthWalletBalance(inEther));
    }, [dispatch, balance]);

    useEffect(() => {
        if (account && balance) {
            fetchEthStore();
        }
    }, [dispatch, account, balance, fetchEthStore]);

    return ethBalance;
};
