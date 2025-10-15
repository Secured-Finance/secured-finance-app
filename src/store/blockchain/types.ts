export interface BlockchainState {
    latestBlock: number;
    chainId: number;
    chainError: boolean;
    lastActionTimestamp: number;
    testnetEnabled: boolean;
    isChainIdDetected: boolean;
}

export const DEFAULT_BLOCKCHAIN_STATE: BlockchainState = {
    latestBlock: 0,
    chainId: 0, // Will be set dynamically based on environment
    chainError: false,
    lastActionTimestamp: 0,
    testnetEnabled: false,
    isChainIdDetected: false,
};

// Legacy export for backward compatibility - will be removed in future version
export type BlockchainStore = BlockchainState;
export const defaultBlockchainStore = DEFAULT_BLOCKCHAIN_STATE;
