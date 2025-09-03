export interface BlockchainStore {
    latestBlock: number;
    chainId: number;
    chainError: boolean;
    lastActionTimestamp: number;
    testnetEnabled: boolean;
    isChainIdDetected: boolean;
}

export const defaultBlockchainStore: BlockchainStore = {
    latestBlock: 0,
    chainId: 0, // Will be set dynamically based on environment
    chainError: false,
    lastActionTimestamp: 0,
    testnetEnabled: false,
    isChainIdDetected: false,
};
