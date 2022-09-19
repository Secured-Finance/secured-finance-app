import BigNumber from 'bignumber.js';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAsset } from 'src/store/assetPrices/selectors';
import {
    connectEthWallet,
    resetEthWallet,
    updateEthWalletBalance,
    updateEthWalletUSDBalance,
} from 'src/store/ethereumWallet';
import { RootState } from 'src/store/types';
import { CurrencySymbol } from 'src/utils';
import { useWallet } from 'use-wallet';

export const useEthereumWalletStore = () => {
    const dispatch = useDispatch();
    const { account, balance, status } = useWallet();
    const { price, change } = useSelector((state: RootState) =>
        getAsset(CurrencySymbol.ETH)(state)
    );
    const ethereumWallet = useSelector(
        (state: RootState) => state.ethereumWallet
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
            dispatch(connectEthWallet(account));
            dispatch(updateEthWalletBalance(inEther));
            dispatch(updateEthWalletUSDBalance(usdBalance));
        },
        [getWalletBalance, balance, price, dispatch]
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
    }, [account, balance, change, fetchEthStore, price]);

    useEffect(() => {
        if (account === null) {
            dispatch(resetEthWallet());
        }
    }, [account, dispatch]);

    return ethereumWallet;
};
