import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { BigNumber } from 'ethers';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAsset } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import {
    connectEthWallet,
    resetEthWallet,
    updateEthBalance,
    updateUsdcBalance,
} from 'src/store/wallet';
import { amountFormatterFromBase, CurrencySymbol } from 'src/utils';
import { USDC } from 'src/utils/currencies/usdc';
import { useWallet } from 'use-wallet';
import { useERC20Balance } from './useERC20Balance';

export const useEthereumWalletStore = (
    securedFinance: SecuredFinanceClient | undefined
) => {
    const dispatch = useDispatch();
    const { account, balance, status } = useWallet();
    const { price, change } = useSelector((state: RootState) =>
        getAsset(CurrencySymbol.ETH)(state)
    );
    const wallet = useSelector((state: RootState) => state.wallet);
    const { getERC20Balance } = useERC20Balance(securedFinance);

    const getWalletBalance = useCallback(
        (balance: number | string) => {
            if (!account) return { inEther: 0 };

            const inEther = amountFormatterFromBase[CurrencySymbol.ETH](
                BigNumber.from(balance)
            );
            return { inEther };
        },
        [account]
    );

    const fetchEthStore = useCallback(
        async (account: string) => {
            const { inEther } = getWalletBalance(balance);
            const a = await getERC20Balance(account, USDC.onChain());
            dispatch(connectEthWallet(account));
            dispatch(
                updateUsdcBalance(
                    amountFormatterFromBase[CurrencySymbol.USDC](
                        a ?? BigNumber.from(0)
                    )
                )
            );
            dispatch(updateEthBalance(inEther));
        },
        [getWalletBalance, balance, dispatch, getERC20Balance]
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

    return wallet;
};
