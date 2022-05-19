import BigNumber from 'bignumber.js';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from 'use-wallet';
import { RootState } from '../store/types';
import { updateTotalUSDBalance } from '../store/wallets';
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

    const fetchWalletStore = useCallback(async () => {
        if (account && balance && ethPrice > 0) {
            dispatch(updateTotalUSDBalance(usdBalance));
        }
    }, [dispatch, account, balance, ethPrice, usdBalance]);

    useEffect(() => {
        fetchWalletStore();
    }, [block, dispatch, account, balance, ethPrice, fetchWalletStore]);

    return totalUSDBalance;
};
