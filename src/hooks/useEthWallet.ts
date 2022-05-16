import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WalletAccountModal } from 'src/components/organisms';
import { RootState } from 'src/store/types';
import {
    resetEthWallet,
    updateEthWalletActions,
    updateEthWalletAddress,
    updateEthWalletAssetPrice,
    updateEthWalletBalance,
    updateEthWalletDailyChange,
    updateEthWalletPortfolioShare,
    updateEthWalletUSDBalance,
} from 'src/store/wallets';
import { recalculateTotalUSDBalance } from 'src/store/wallets/helpers';
import { useWallet } from 'use-wallet';
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

    const actObj = useMemo(() => {
        return {
            send: onPresentAccountModal,
            placeCollateral: onPresentAccountModal,
            signOut: reset,
        };
    }, [onPresentAccountModal, reset]);

    const getWalletBalance = useCallback(() => {
        if (!account) return { usdBalance: 0, inEther: 0 };

        const inEther = new BigNumber(balance)
            .dividedBy(new BigNumber(10).pow(18))
            .toNumber();
        const usdBalance = new BigNumber(inEther)
            .times(new BigNumber(price))
            .toNumber();
        return { usdBalance, inEther };
    }, [account, balance, price]);

    const fetchEthStore = useCallback(
        async (isMounted: boolean) => {
            const { usdBalance, inEther } = getWalletBalance();
            const portfolioShare = new BigNumber(usdBalance)
                .times(100)
                .dividedBy(new BigNumber(totalUSDBalance))
                .toNumber();

            dispatch(updateEthWalletAddress(account));
            dispatch(updateEthWalletBalance(inEther));
            dispatch(updateEthWalletAssetPrice(price));
            dispatch(updateEthWalletDailyChange(change));
            dispatch(updateEthWalletUSDBalance(usdBalance));
            if (portfolioShare !== (null || Infinity)) {
                dispatch(updateEthWalletPortfolioShare(portfolioShare));
            }
            dispatch(recalculateTotalUSDBalance());
            dispatch(updateEthWalletActions(actObj));
        },
        [
            getWalletBalance,
            totalUSDBalance,
            dispatch,
            account,
            price,
            change,
            actObj,
        ]
    );

    useEffect(() => {
        let isMounted = true;
        if (
            account &&
            balance &&
            reset &&
            totalUSDBalance !== 0 &&
            price !== 0 &&
            change !== 0
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
        fetchEthStore,
    ]);

    useEffect(() => {
        const { inEther, usdBalance } = getWalletBalance();
        dispatch(updateEthWalletBalance(inEther));
        dispatch(updateEthWalletUSDBalance(usdBalance));
        dispatch(recalculateTotalUSDBalance());
    }, [balance, dispatch, getWalletBalance]);

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

    const fetchEthStore = useCallback(
        async (isMounted: boolean) => {
            const inEther = new BigNumber(balance)
                .dividedBy(new BigNumber(10).pow(18))
                .toNumber();
            dispatch(updateEthWalletBalance(inEther));
        },
        [dispatch, balance]
    );

    useEffect(() => {
        let isMounted = true;
        if (account && balance) {
            fetchEthStore(isMounted);
        }
        return () => {
            isMounted = false;
        };
    }, [dispatch, account, balance, fetchEthStore]);

    return ethBalance;
};
