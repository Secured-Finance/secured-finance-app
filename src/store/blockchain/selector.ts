import { RootState } from '../types';

type Networks = 'mainnet' | 'sepolia' | 'arbitrum-one' | 'arbitrum-sepolia';

export const Networks: Record<number, Networks> = {
    1: 'mainnet',
    11155111: 'sepolia',
    42161: 'arbitrum-one',
    421614: 'arbitrum-sepolia',
};

export const selectLastUserActionTimestamp = (state: RootState) =>
    state.blockchain.lastActionTimestamp;

export const selectNetworkName = (state: RootState) =>
    Networks[state.blockchain.chainId];
