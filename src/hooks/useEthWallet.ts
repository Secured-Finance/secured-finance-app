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
    const { account, balance: ethBalance, status } = useWallet();
    const { price, change } = useSelector((state: RootState) =>
        getAsset(CurrencySymbol.ETH)(state)
    );
    const wallet = useSelector((state: RootState) => state.wallet);
    const { getERC20Balance } = useERC20Balance(securedFinance);

    const getWalletBalance = useCallback(async () => {
        if (!account) return { inEther: 0, inUsdc: 0 };

        const usdcBalance = await getERC20Balance(account, USDC.onChain());

        const inEther = amountFormatterFromBase[CurrencySymbol.ETH](
            BigNumber.from(ethBalance)
        );
        const inUsdc =
            amountFormatterFromBase[CurrencySymbol.USDC](usdcBalance);

        return { inEther, inUsdc };
    }, [account, getERC20Balance, ethBalance]);

    const fetchWalletStore = useCallback(
        async (account: string) => {
            const { inEther, inUsdc } = await getWalletBalance();
            dispatch(connectEthWallet(account));
            dispatch(updateUsdcBalance(inUsdc));
            dispatch(updateEthBalance(inEther));
        },
        [getWalletBalance, dispatch]
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
            fetchWalletStore(account);
        }
    }, [account, ethBalance, change, fetchWalletStore, price]);

    useEffect(() => {
        if (account === null) {
            dispatch(resetEthWallet());
        }
    }, [account, dispatch]);

    return wallet;
};
