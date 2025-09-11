import { Environment } from 'src/utils';
import { filecoin, filecoinCalibration } from 'viem/chains';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { BlockchainState, DEFAULT_BLOCKCHAIN_STATE } from './types';

interface BlockchainActions {
    updateLatestBlock: (latestBlock: number) => void;
    updateChainId: (chainId: number) => void;
    updateChainError: (chainError: boolean) => void;
    updateLastActionTimestamp: () => void;
    updateTestnetEnabled: (testnetEnabled: boolean) => void;
    updateIsChainIdDetected: (isChainIdDetected: boolean) => void;
    resetStore: () => void;
}

type BlockchainStoreWithActions = BlockchainState & BlockchainActions;

const initialChainId =
    process.env.SF_ENV === Environment?.PRODUCTION
        ? filecoin.id
        : filecoinCalibration.id;

export const useBlockchainStore = create<BlockchainStoreWithActions>()(
    subscribeWithSelector(set => ({
        ...DEFAULT_BLOCKCHAIN_STATE,
        chainId: initialChainId,

        updateLatestBlock: (latestBlock: number) => set({ latestBlock }),
        updateChainId: (chainId: number) => set({ chainId }),
        updateChainError: (chainError: boolean) => set({ chainError }),
        updateLastActionTimestamp: () =>
            set({ lastActionTimestamp: Date.now() }),
        updateTestnetEnabled: (testnetEnabled: boolean) =>
            set({ testnetEnabled }),
        updateIsChainIdDetected: (isChainIdDetected: boolean) =>
            set({ isChainIdDetected }),

        // Reset actions
        resetStore: () =>
            set({ ...DEFAULT_BLOCKCHAIN_STATE, chainId: initialChainId }),
    }))
);
