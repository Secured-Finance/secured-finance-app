import {
    Chain,
    arbitrum,
    arbitrumSepolia,
    avalanche,
    avalancheFuji,
    mainnet,
    sepolia,
} from 'viem/chains';
import { isProdEnv } from './displayUtils';

// it is important to keep sepolia as first chain in this list
const testnetNetworks: Chain[] = [sepolia, arbitrumSepolia, avalancheFuji];

// it is important to keep mainnet as first chain in this list
const mainnetNetworks: Chain[] = [mainnet, arbitrum, avalanche];

export const getSupportedNetworks = () => {
    return isProdEnv()
        ? mainnetNetworks.concat(testnetNetworks)
        : testnetNetworks;
};
