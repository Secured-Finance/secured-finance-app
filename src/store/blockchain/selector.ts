import { RootState } from '../types';

type Networks = 'mainnet' | 'goerli' | 'sepolia';

const Networks: Record<number, Networks> = {
    1: 'mainnet',
    5: 'goerli',
    11155111: 'sepolia',
};

export const selectLastUserActionTimestamp = (state: RootState) =>
    state.blockchain.lastActionTimestamp;

export const selectNetworkName = (state: RootState) =>
    Networks[state.blockchain.chainId];
