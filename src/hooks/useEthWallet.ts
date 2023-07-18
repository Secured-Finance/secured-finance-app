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
    CurrencySymbol,
    amountFormatterFromBase,
    getCurrencyMapAsList,
} from 'src/utils';
import { useAccount, useBalance } from 'wagmi';
import { useERC20Balance } from './useERC20Balance';

export const useEthereumWalletStore = (
    securedFinance: SecuredFinanceClient | undefined
) => {
    const dispatch = useDispatch();
    const { address, isConnected } = useAccount();
    const { data: ethBalance } = useBalance({ address });
    const { price, change } = useSelector((state: RootState) =>
        getAsset(CurrencySymbol.ETH)(state)
    );
    const wallet = useSelector((state: RootState) => state.wallet);
    const { getERC20Balance } = useERC20Balance(securedFinance);

    const getWalletBalance = useCallback(async () => {
        if (!address) return zeroBalances;

        const result: Record<string, number> = {};

        for (const currency of getCurrencyMapAsList()) {
            if (currency.toCurrency().isToken) {
                result[currency.symbol] = amountFormatterFromBase[
                    currency.symbol
                ](
                    await getERC20Balance(
                        address,
                        currency.toCurrency() as Token
                    )
                );
            } else {
                result[currency.symbol] = amountFormatterFromBase[
                    currency.symbol
                ](BigNumber.from(ethBalance?.value ?? 0));
            }
        }

        return result as Record<CurrencySymbol, number>;
    }, [address, getERC20Balance, ethBalance]);

    const fetchWalletStore = useCallback(
        async (account: string) => {
            const balances = await getWalletBalance();
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
        if (isConnected && address) {
            connectWallet(address);
        }
    }, [isConnected, connectWallet, address]);

    useEffect(() => {
        if (address) {
            fetchWalletStore(address);
        }
    }, [address, ethBalance, change, fetchWalletStore, price]);

    useEffect(() => {
        if (!isConnected) {
            dispatch(resetEthWallet());
        }
    }, [dispatch, isConnected]);

    return wallet;
};
