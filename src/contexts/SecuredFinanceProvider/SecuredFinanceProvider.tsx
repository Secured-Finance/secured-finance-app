import { reset, track } from '@amplitude/analytics-browser';
import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { useQueryClient } from '@tanstack/react-query';
import { Signer, providers } from 'ethers';
import { createContext, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { QUERIES_TO_INVALIDATE } from 'src/hooks';
import { useEthereumWalletStore } from 'src/hooks/useEthWallet';
import { updateChainError, updateLatestBlock } from 'src/store/blockchain';
import { getEthereumChainId, readWalletFromStore } from 'src/utils';
import { InterfaceEvents, associateWallet } from 'src/utils/events';
import { hexToNumber } from 'viem';
import {
    useAccount,
    useConnect,
    usePublicClient,
    useWalletClient,
} from 'wagmi';

export const CACHED_PROVIDER_KEY = 'CACHED_PROVIDER_KEY';

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ethereum: any;
    }
}

export interface SFContext {
    securedFinance?: SecuredFinanceClient;
}

export const Context = createContext<SFContext>({
    securedFinance: undefined,
});

const SecuredFinanceProvider: React.FC = ({ children }) => {
    const [web3Provider, setWeb3Provider] =
        useState<providers.BaseProvider | null>(null);
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { data: client } = useWalletClient();
    const publicClient = usePublicClient();
    const queryClient = useQueryClient();

    const [securedFinance, setSecuredFinance] =
        useState<SecuredFinanceClient>();
    const dispatch = useDispatch();

    useEthereumWalletStore();

    const handleAccountChanged = useCallback((accounts: string[]) => {
        track(InterfaceEvents.WALLET_CHANGED_THROUGH_PROVIDER);
        reset();
        if (accounts.length > 0) {
            associateWallet(accounts[0]);
        }
    }, []);

    const dispatchChainError = useCallback(
        (chainId: number) => {
            dispatch(updateChainError(chainId !== getEthereumChainId()));
        },
        [dispatch]
    );

    const handleChainChanged = useCallback(
        (chainId: number) => {
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
                dispatchChainError(hexToNumber(chainId));
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
        };
        if (isConnected && client?.chain && client?.transport) {
            const provider = new providers.Web3Provider(
                client?.transport,
                client?.chain.id
            );
            const signer = provider.getSigner();
            connectSFClient(provider, signer);
        } else if (
            !isConnected &&
            publicClient?.transport &&
            publicClient?.chain
        ) {
            const provider = new providers.Web3Provider(
                publicClient?.transport,
                publicClient?.chain.id
            );
            connectSFClient(provider);
        }
    }, [
        dispatch,
        handleAccountChanged,
        client?.transport,
        client,
        isConnected,
        publicClient?.transport,
        publicClient?.chain,
    ]);

    useEffect(() => {
        if (address) {
            associateWallet(address, false);
            return;
        }

        const cachedProvider = readWalletFromStore();
        if (cachedProvider && cachedProvider === 'MetaMask') {
            const connector = connectors.find(
                connector => connector.name === cachedProvider
            );
            if (connector) connect({ connector: connector });
        }
    }, [connect, address, connectors]);

    useEffect(() => {
        if (!web3Provider) return;
        web3Provider.on('block', blockNumber => {
            if (blockNumber && typeof blockNumber === 'number') {
                dispatch(updateLatestBlock(blockNumber));

                // Invalidate all queries
                Promise.all(
                    QUERIES_TO_INVALIDATE.map(queryKey =>
                        queryClient.invalidateQueries({ queryKey: [queryKey] })
                    )
                );
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
        handleAccountChanged,
        handleChainChanged,
        queryClient,
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
