import { retryWithBackoff } from 'src/store/utils';
import { Environment } from 'src/utils';
import { filecoin, filecoinCalibration } from 'viem/chains';
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { BlockchainState, DEFAULT_BLOCKCHAIN_STATE } from './types';

interface BlockchainActions {
    updateLatestBlock: (latestBlock: number) => void;
    updateChainId: (chainId: number) => void;
    updateChainError: (chainError: boolean) => void;
    updateLastActionTimestamp: () => void;
    updateTestnetEnabled: (testnetEnabled: boolean) => void;
    updateIsChainIdDetected: (isChainIdDetected: boolean) => void;
    resetStore: () => void;
    clearPersisted: () => void;
    hasPersisted: () => boolean;
}

type BlockchainStoreWithActions = BlockchainState & BlockchainActions;

const initialChainId =
    process.env.SF_ENV === Environment?.PRODUCTION
        ? filecoin.id
        : filecoinCalibration.id;

// Load persisted testnet setting
const getInitialTestnetEnabled = (): boolean => {
    try {
        const stored = localStorage.getItem('blockchain-testnet-enabled');
        return stored ? JSON.parse(stored) : false;
    } catch {
        return false;
    }
};

export const useBlockchainStore = create<BlockchainStoreWithActions>()(
    devtools(
        persist(
            subscribeWithSelector(set => ({
                ...DEFAULT_BLOCKCHAIN_STATE,
                chainId: initialChainId,
                testnetEnabled: getInitialTestnetEnabled(),

                clearPersisted: () => {
                    localStorage.removeItem('blockchain-testnet-enabled');
                },
                hasPersisted: () => {
                    return (
                        localStorage.getItem('blockchain-testnet-enabled') !==
                        null
                    );
                },

                updateLatestBlock: (latestBlock: number) =>
                    set({ latestBlock }),
                updateChainId: (chainId: number) => {
                    void retryWithBackoff(async () => {
                        set({ chainId });
                        return true;
                    });
                },
                updateChainError: (chainError: boolean) => set({ chainError }),
                updateLastActionTimestamp: () =>
                    set({ lastActionTimestamp: Date.now() }),
                updateTestnetEnabled: (testnetEnabled: boolean) => {
                    void retryWithBackoff(async () => {
                        set({ testnetEnabled });
                        localStorage.setItem(
                            'blockchain-testnet-enabled',
                            JSON.stringify(testnetEnabled)
                        );
                        return true;
                    });
                },
                updateIsChainIdDetected: (isChainIdDetected: boolean) =>
                    set({ isChainIdDetected }),

                resetStore: () =>
                    set({
                        ...DEFAULT_BLOCKCHAIN_STATE,
                        chainId: initialChainId,
                    }),
            })),
            {
                name: 'blockchain-settings',
                partialize: state => ({
                    testnetEnabled: state.testnetEnabled,
                    chainId: state.chainId,
                }),
            }
        ),
        { name: 'BlockchainStore' }
    )
);
