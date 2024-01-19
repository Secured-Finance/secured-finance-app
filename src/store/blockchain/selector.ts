import { RootState } from '../types';

type Networks =
    | 'mainnet'
    | 'sepolia'
    | 'arbitrum-one'
    | 'arbitrum-sepolia'
    | 'avalanche-fuji'
    | 'avalanche-mainnet';

export const Networks: Record<number, Networks> = {
    1: 'mainnet',
    11155111: 'sepolia',
    42161: 'arbitrum-one',
    421614: 'arbitrum-sepolia',
    43113: 'avalanche-fuji',
    43114: 'avalanche-mainnet',
};

export const selectLastUserActionTimestamp = (state: RootState) =>
    state.blockchain.lastActionTimestamp;

export const selectNetworkName = (state: RootState) =>
    Networks[state.blockchain.chainId];
