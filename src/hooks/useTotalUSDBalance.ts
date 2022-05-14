import BigNumber from 'bignumber.js';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from 'use-wallet';
import { RootState } from '../store/types';
import {
    fetchWallet,
    fetchWalletFailure,
    updateTotalUSDBalance,
} from '../store/wallets';
import useBlock from './useBlock';

export const useTotalUSDBalance = () => {
    const { account, balance } = useWallet();
    const block = useBlock();
    const dispatch = useDispatch();
    const totalUSDBalance = useSelector(
        (state: RootState) => state.wallets.totalUSDBalance
    );

    const ethPrice = useSelector(
        (state: RootState) => state.assetPrices.ethereum.price
    );
    const inEth = new BigNumber(balance)
        .dividedBy(new BigNumber(10).pow(18))
        .toNumber();
    const usdBalance = new BigNumber(inEth)
        .times(new BigNumber(ethPrice))
        .toNumber();

    const fetchWalletStore = useCallback(
        async (isMounted: boolean) => {
            await dispatch(fetchWallet());
            if (account && balance && ethPrice > 0) {
                dispatch(updateTotalUSDBalance(usdBalance));
            } else {
                dispatch(fetchWalletFailure());
            }
        },
        [dispatch, account, balance, ethPrice, usdBalance]
    );

    useEffect(() => {
        let isMounted = true;
        fetchWalletStore(isMounted);
        return () => {
            isMounted = false;
        };
    }, [block, dispatch, account, balance, ethPrice, fetchWalletStore]);

    return totalUSDBalance;
};
