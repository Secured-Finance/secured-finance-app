import { reset, track } from '@amplitude/analytics-browser';
import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { Signer, getDefaultProvider, providers } from 'ethers';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLendingMarkets } from 'src/hooks';
import { useEthereumWalletStore } from 'src/hooks/useEthWallet';
import { updateChainError, updateLatestBlock } from 'src/store/blockchain';
import {
    getCurrencyMapAsList,
    getEthereumChainId,
    getRpcEndpoint,
    hexToDec,
} from 'src/utils';
import { InterfaceEvents, associateWallet } from 'src/utils/events';
import { useWallet } from 'use-wallet';

export const CACHED_PROVIDER_KEY = 'CACHED_PROVIDER_KEY';

export interface SFContext {
    securedFinance?: SecuredFinanceClient;
}

export const Context = createContext<SFContext>({
    securedFinance: undefined,
});

declare global {
    interface Window {
        securedFinanceSDK: SecuredFinanceClient;
    }
}

const SecuredFinanceProvider: React.FC = ({ children }) => {
    const [web3Provider, setWeb3Provider] =
        useState<providers.BaseProvider | null>(null);
    const { error, status, connect, account, ethereum, isConnected } =
        useWallet();
    const [securedFinance, setSecuredFinance] =
        useState<SecuredFinanceClient>();
    const dispatch = useDispatch();

    //TODO: move this to redux listener to reduce the number of calls and rerenders
    useEthereumWalletStore(securedFinance);
    const { fetchLendingMarkets } = useLendingMarkets();

    const handleAccountChanged = useCallback((accounts: string[]) => {
        track(InterfaceEvents.WALLET_CHANGED_THROUGH_PROVIDER);
        reset();
        if (accounts.length > 0) {
            associateWallet(accounts[0]);
        }
    }, []);

    const dispatchChainError = useCallback(
        (chainId: string) => {
            dispatch(
                updateChainError(hexToDec(chainId) !== getEthereumChainId())
            );
        },
        [dispatch]
    );

    const handleChainChanged = useCallback(
        (chainId: string) => {
            dispatchChainError(chainId);
        },
        [dispatchChainError]
    );

    useEffect(() => {
        // this is required to get the chainId on initial page load
        const fetchChainId = async () => {
            if (window.ethereum) {
                const chainId = await window.ethereum.request({
                    method: 'eth_chainId',
                });
                dispatchChainError(chainId);
            }
        };
        fetchChainId();
        window.ethereum?.on('chainChanged', handleChainChanged);
        return () => {
            window.ethereum?.removeListener('chainChanged', handleChainChanged);
        };
    }, [dispatchChainError, handleChainChanged]);

    useEffect(() => {
        const connectSFClient = async (
            provider: providers.BaseProvider,
            signer?: Signer
        ) => {
            setWeb3Provider(provider);
            const network = await provider.getNetwork();

            const securedFinanceLib = new SecuredFinanceClient();
            await securedFinanceLib.init(signer || provider, network);

            setSecuredFinance(previous => {
                if (!previous) {
                    return securedFinanceLib;
                }

                if (
                    previous.config.signerOrProvider instanceof
                    providers.BaseProvider
                ) {
                    return securedFinanceLib;
                }

                return previous;
            });
            window.securedFinanceSDK = securedFinanceLib;
        };
        if (ethereum) {
            const chainId = Number(ethereum.chainId);
            const provider = window.localStorage.getItem('FORK')
                ? ethereum?.provider
                : new providers.Web3Provider(ethereum, chainId);
            const signer = provider.getSigner();
            connectSFClient(provider, signer);
            ethereum.on('accountsChanged', handleAccountChanged);

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener(
                        'accountsChanged',
                        handleAccountChanged
                    );
                }
            };
        } else if (!isConnected()) {
            const provider = getDefaultProvider(getRpcEndpoint());
            connectSFClient(provider);
        }
    }, [ethereum, isConnected, dispatch, handleAccountChanged]);

    useEffect(() => {
        if (status === 'error') {
            console.error(error);
        }
    }, [status, error]);

    useEffect(() => {
        if (account) {
            associateWallet(account, false);
            return;
        }

        const cachedProvider = localStorage.getItem(CACHED_PROVIDER_KEY);
        if (cachedProvider !== null) {
            connect('injected');
        }
    }, [connect, account]);

    useEffect(() => {
        if (!web3Provider) return;
        web3Provider.on('block', blockNumber => {
            if (blockNumber && typeof blockNumber === 'number') {
                dispatch(updateLatestBlock(blockNumber));
                for (const currency of getCurrencyMapAsList()) {
                    fetchLendingMarkets(currency.symbol, securedFinance);
                }
            }
        });
        return () => {
            web3Provider?.removeAllListeners('block');
        };
    }, [dispatch, fetchLendingMarkets, securedFinance, web3Provider]);

    return (
        <Context.Provider value={{ securedFinance }}>
            {children}
        </Context.Provider>
    );
};

export default SecuredFinanceProvider;
