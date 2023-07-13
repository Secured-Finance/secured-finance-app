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
} from 'src/utils';
import { InterfaceEvents, associateWallet } from 'src/utils/events';
import { useAccount, useConnect, useNetwork, useWalletClient } from 'wagmi';

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
    const { address: account, isConnected } = useAccount();
    const { connect } = useConnect();
    const { chain } = useNetwork();
    const { data: client } = useWalletClient();

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
                updateChainError(Number(chainId) !== getEthereumChainId())
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
            if (client) {
                const chainId = await client?.getChainId();
                dispatchChainError(chainId.toString());
            }
        };
        fetchChainId();
    }, [client, dispatchChainError]);

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
        if (isConnected && chain && client?.transport) {
            const provider = new providers.Web3Provider(
                client?.transport,
                chain.id
            );
            const signer = provider.getSigner();
            connectSFClient(provider, signer);
        } else if (!isConnected) {
            const provider = getDefaultProvider(getRpcEndpoint());
            connectSFClient(provider);
        }
    }, [isConnected, dispatch, handleAccountChanged, chain, client?.transport]);

    useEffect(() => {
        if (account) {
            associateWallet(account, false);
            return;
        }

        const cachedProvider = localStorage.getItem(CACHED_PROVIDER_KEY);
        if (cachedProvider !== null) {
            connect();
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

        web3Provider.on('accountsChanged', handleAccountChanged);
        web3Provider.on('chainChanged', handleChainChanged);

        return () => {
            web3Provider.removeAllListeners('accountsChanged');
            web3Provider.removeAllListeners('chainChanged');
            web3Provider.removeAllListeners('block');
        };
    }, [
        dispatch,
        fetchLendingMarkets,
        handleAccountChanged,
        handleChainChanged,
        securedFinance,
        web3Provider,
    ]);

    return (
        <Context.Provider value={{ securedFinance }}>
            {children}
        </Context.Provider>
    );
};

export default SecuredFinanceProvider;
