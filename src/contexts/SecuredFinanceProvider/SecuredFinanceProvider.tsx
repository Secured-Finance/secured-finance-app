import { reset, track } from '@amplitude/analytics-browser';
import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { createContext, useCallback, useEffect, useState } from 'react';
import { QUERIES_TO_INVALIDATE } from 'src/hooks';
import { useWallet } from 'src/hooks/useWallet';
import { useBlockchainStore, useUIStore } from 'src/store';
import {
    getSupportedChainIds,
    getSupportedNetworks,
    readWalletFromStore,
} from 'src/utils';
import {
    InterfaceEvents,
    InterfaceProperties,
    associateWallet,
} from 'src/utils/events';
import { HexConverter } from 'src/utils';
import {
    PublicClient,
    WalletClient,
    useAccount,
    useConnect,
    useNetwork,
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

const SecuredFinanceProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    const chainId = useBlockchainStore(state => state.chainId);
    const updateChainId = useBlockchainStore(state => state.updateChainId);
    const updateChainError = useBlockchainStore(
        state => state.updateChainError
    );
    const updateLatestBlock = useBlockchainStore(
        state => state.updateLatestBlock
    );
    const updateIsChainIdDetected = useBlockchainStore(
        state => state.updateIsChainIdDetected
    );
    const { connect, connectors } = useConnect();
    const { data: client } = useWalletClient();
    const publicClient = usePublicClient({
        chainId: chainId,
    });
    const queryClient = useQueryClient();

    const [securedFinance, setSecuredFinance] =
        useState<SecuredFinanceClient>();
    const { setWalletDialogOpen } = useUIStore();

    useWallet();

    const chainName = getSupportedNetworks().find(n => n.id === chainId)?.name;

    const handleAccountChanged = useCallback(
        (accounts: string[]) => {
            track(InterfaceEvents.WALLET_CHANGED_THROUGH_PROVIDER, {
                [InterfaceProperties.CHAIN]: chainName,
            });
            reset();
            if (accounts.length > 0) {
                associateWallet(accounts[0], chainName);
            }
        },
        [chainName]
    );

    const dispatchChainError = useCallback(
        (chainId: number) => {
            updateChainError(!getSupportedChainIds().includes(chainId));
            updateChainId(chainId);
        },
        [updateChainError, updateChainId]
    );

    const handleChainChanged = useCallback(
        (chainId: string) => {
            dispatchChainError(HexConverter.hexToNumber(chainId));
            track(InterfaceEvents.CHAIN_CONNECTED, {
                [InterfaceProperties.CHAIN]: chainName,
            });
        },
        [chainName, dispatchChainError]
    );

    useEffect(() => {
        // this is required to get the chainId on initial page load
        const fetchChainId = async () => {
            if (window.ethereum) {
                const chainId = await window.ethereum.request({
                    method: 'eth_chainId',
                });
                updateIsChainIdDetected(true);
                dispatchChainError(HexConverter.hexToNumber(chainId));
            }
        };
        fetchChainId();
        window.ethereum?.on('chainChanged', handleChainChanged);
        return () => {
            window.ethereum?.removeListener('chainChanged', handleChainChanged);
        };
    }, [dispatchChainError, handleChainChanged, updateIsChainIdDetected]);

    useEffect(() => {
        if (chain) {
            dispatchChainError(chain.id);
        }
    }, [chain, dispatchChainError]);

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

                if (securedFinanceLib.config.chain.id !== chainId) {
                    return previous;
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
        handleAccountChanged,
        client?.transport,
        client,
        isConnected,
        publicClient?.transport,
        publicClient?.chain,
        publicClient,
        chainId,
    ]);

    useEffect(() => {
        if (address) {
            associateWallet(address, chainName, false);
            return;
        }

        const cachedProvider = readWalletFromStore();
        if (cachedProvider && cachedProvider === 'MetaMask') {
            const connector = connectors.find(
                connector => connector.name === cachedProvider
            );
            if (connector) connect({ connector: connector });
        }
    }, [connect, address, connectors, chainName]);

    useEffect(() => {
        if (!publicClient) return;

        const unwatch = publicClient.watchBlockNumber({
            onBlockNumber: blockNumber => {
                if (blockNumber && typeof blockNumber === 'bigint') {
                    updateLatestBlock(Number(blockNumber));

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
            pollingInterval: chainId.toString().startsWith('314')
                ? 12_000
                : 4_000,
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
        chainId,
        handleAccountChanged,
        handleChainChanged,
        publicClient,
        queryClient,
        securedFinance,
        updateLatestBlock,
    ]);

    useEffect(() => {
        const selectedChainId = Number(searchParams.get('chain_id'));

        if (isNaN(selectedChainId)) return;

        if (selectedChainId === chainId) {
            const newSearchParams = new URLSearchParams(
                searchParams.toString()
            );
            newSearchParams.delete('chain_id');

            router.push(
                Array.from(newSearchParams.keys()).length === 0
                    ? ''
                    : `?${newSearchParams.toString()}`
            );
        } else if (getSupportedChainIds().includes(selectedChainId)) {
            const provider = readWalletFromStore();
            const connector = connectors.find(
                connect => connect.name === provider
            );

            if (connector) {
                connector.switchChain?.(selectedChainId);
            } else {
                setWalletDialogOpen(true);
            }
        }
    }, [searchParams, chainId, connectors, router, setWalletDialogOpen]);

    return (
        <Context.Provider value={{ securedFinance }}>
            {children}
        </Context.Provider>
    );
};

export default SecuredFinanceProvider;
