export type Blockchain = {
    latestBlock: number;
    chainId: number;
    chainError: boolean;
    lastActionTimestamp: number;
    testnetEnabled: boolean;
    isChainIdDetected: boolean;
};
