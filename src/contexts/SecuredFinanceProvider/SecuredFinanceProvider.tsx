import { reset, track } from '@amplitude/analytics-browser';
import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { QUERIES_TO_INVALIDATE } from 'src/hooks';
import { useEthereumWalletStore } from 'src/hooks/useEthWallet';
import {
    updateChainError,
    updateChainId,
    updateLatestBlock,
} from 'src/store/blockchain';
import { getSupportedChainIds, readWalletFromStore } from 'src/utils';
import { InterfaceEvents, associateWallet } from 'src/utils/events';
import { hexToNumber } from 'viem';
import {
    PublicClient,
    WalletClient,
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
            dispatch(
                updateChainError(!getSupportedChainIds().includes(chainId))
            );
            // dispatch(updateChainError(chainId !== getMainnetChainId()));
            dispatch(updateChainId(chainId));
        },
        [dispatch]
    );

    const handleChainChanged = useCallback(
        (chainId: string) => {
            dispatchChainError(hexToNumber(chainId as `0x${string}`));
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
        window.ethereum?.on('chainChanged', handleChainChanged);
        return () => {
            window.ethereum?.removeListener('chainChanged', handleChainChanged);
        };
    }, [dispatchChainError, handleChainChanged]);

    useEffect(() => {
        const connectSFClient = async (
            publicClient: PublicClient,
            walletClient?: WalletClient
        ) => {
            const securedFinanceLib = new SecuredFinanceClient();
            await securedFinanceLib.init(publicClient, walletClient);

            setSecuredFinance(previous => {
                if (!previous) {
                    return securedFinanceLib;
                }

                if (isConnected) {
                    return securedFinanceLib;
                }

                return previous;
            });
        };
        if (
            isConnected &&
            publicClient?.transport &&
            publicClient?.chain &&
            client?.chain &&
            client?.transport
        ) {
            connectSFClient(publicClient, client);
        } else if (
            !isConnected &&
            publicClient?.transport &&
            publicClient?.chain
        ) {
            connectSFClient(publicClient);
        }
    }, [
        dispatch,
        handleAccountChanged,
        client?.transport,
        client,
        isConnected,
        publicClient?.transport,
        publicClient?.chain,
        publicClient,
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
        if (!publicClient) return;

        const unwatch = publicClient.watchBlockNumber({
            onBlockNumber: blockNumber => {
                if (blockNumber && typeof blockNumber === 'bigint') {
                    dispatch(updateLatestBlock(Number(blockNumber)));

                    // Invalidate all queries
                    Promise.all(
                        QUERIES_TO_INVALIDATE.map(queryKey =>
                            queryClient.invalidateQueries({
                                queryKey: [queryKey],
                            })
                        )
                    );
                }
            },
        });

        window.ethereum?.on('accountsChanged', handleAccountChanged);

        return () => {
            unwatch();
            window.ethereum?.removeListener(
                'accountsChanged',
                handleAccountChanged
            );
        };
    }, [
        dispatch,
        handleAccountChanged,
        handleChainChanged,
        publicClient,
        queryClient,
        securedFinance,
    ]);

    return (
        <Context.Provider value={{ securedFinance }}>
            {children}
        </Context.Provider>
    );
};

export default SecuredFinanceProvider;
