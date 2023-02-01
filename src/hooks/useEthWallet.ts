import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { Token } from '@secured-finance/sf-core';
import { BigNumber } from 'ethers';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAsset } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import {
    connectEthWallet,
    resetEthWallet,
    updateBalance,
    zeroBalances,
} from 'src/store/wallet';
import {
    amountFormatterFromBase,
    CurrencySymbol,
    getCurrencyMapAsList,
} from 'src/utils';
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
        if (!account) return zeroBalances;

        const result: Record<string, number> = {};

        for (const currency of getCurrencyMapAsList()) {
            if (currency.toCurrency().isToken) {
                result[currency.symbol] = amountFormatterFromBase[
                    currency.symbol
                ](
                    await getERC20Balance(
                        account,
                        currency.toCurrency() as Token
                    )
                );
            } else {
                result[currency.symbol] = amountFormatterFromBase[
                    currency.symbol
                ](BigNumber.from(ethBalance));
            }
        }

        return result as Record<CurrencySymbol, number>;
    }, [account, getERC20Balance, ethBalance]);

    const fetchWalletStore = useCallback(
        async (account: string) => {
            const balances = await getWalletBalance();
            console.log('balances', balances);
            dispatch(connectEthWallet(account));

            for (const currency of Object.keys(balances) as CurrencySymbol[]) {
                dispatch(updateBalance(balances[currency], currency));
            }
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
