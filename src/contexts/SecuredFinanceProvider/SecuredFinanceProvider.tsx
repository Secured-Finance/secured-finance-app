import { reset, track } from '@amplitude/analytics-browser';
import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { getDefaultProvider, providers, Signer } from 'ethers';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLendingMarkets } from 'src/hooks';
import { useEthereumWalletStore } from 'src/hooks/useEthWallet';
import { updateChainError, updateLatestBlock } from 'src/store/blockchain';
import { getEthereumChainId, getRpcEndpoint, hexToDec } from 'src/utils';
import { associateWallet, InterfaceEvents } from 'src/utils/events';
import { ChainUnsupportedError, useWallet } from 'use-wallet';

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

    useEthereumWalletStore(securedFinance);
    useLendingMarkets(securedFinance);

    const handleNetworkChanged = useCallback(
        (networkId: string) => {
            if (hexToDec(networkId) !== getEthereumChainId()) {
                dispatch(updateChainError(true));
                alert('Unsupported network, please use Goerli (Chain ID: 5)');
            }
        },
        [dispatch]
    );

    const handleAccountChanged = useCallback((accounts: string[]) => {
        track(InterfaceEvents.WALLET_CHANGED_THROUGH_PROVIDER);
        reset();
        if (accounts.length > 0) {
            associateWallet(accounts[0]);
        }
    }, []);

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
            ethereum.on('chainChanged', handleNetworkChanged);
            ethereum.on('accountsChanged', handleAccountChanged);

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener(
                        'chainChanged',
                        handleNetworkChanged
                    );
                    ethereum.removeListener(
                        'accountsChanged',
                        handleAccountChanged
                    );
                    dispatch(updateChainError(false));
                }
            };
        } else if (!isConnected()) {
            const provider = getDefaultProvider(getRpcEndpoint());
            connectSFClient(provider);
        }
    }, [
        ethereum,
        isConnected,
        handleNetworkChanged,
        dispatch,
        handleAccountChanged,
    ]);

    useEffect(() => {
        if (status === 'error') {
            if (error instanceof ChainUnsupportedError) {
                alert('Unsupported network, please use Goerli (Chain ID: 5)');
            } else {
                console.error(error);
            }
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

    // Update the latest block every 2 seconds with the latest block number.
    // If we are working with a fork, we just update it once with a hardcoded block number.
    useEffect(() => {
        if (!web3Provider) return;

        const interval = setInterval(async () => {
            const block = window.localStorage.getItem('FORK')
                ? 0
                : await web3Provider.getBlockNumber();
            dispatch(updateLatestBlock(block));
        }, 2000);

        return () => clearInterval(interval);
    }, [dispatch, web3Provider]);

    return (
        <Context.Provider value={{ securedFinance }}>
            {children}
        </Context.Provider>
    );
};

export default SecuredFinanceProvider;
