import {
    Chain,
    arbitrum,
    arbitrumSepolia,
    avalancheFuji,
    mainnet,
    sepolia,
} from 'viem/chains';

export const supportedNetworks: Chain[] = [
    sepolia,
    mainnet,
    arbitrum,
    arbitrumSepolia,
    avalancheFuji,
];
