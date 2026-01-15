import Arbitrum from 'src/assets/icons/arbitrum-network.svg';
import Avalanche from 'src/assets/icons/avalanche-network.svg';
import Ethereum from 'src/assets/icons/ethereum-network.svg';
import Filecoin from 'src/assets/icons/filecoin-network.svg';
import Polygon from 'src/assets/icons/polygon-network.svg';
import {
    Chain,
    arbitrum,
    arbitrumSepolia,
    avalanche,
    avalancheFuji,
    filecoin,
    filecoinCalibration,
    mainnet,
    polygonZkEvm,
    sepolia,
} from 'viem/chains';
import { isProdEnv } from './displayUtils';

type ChainPair = {
    mainnet: Chain;
    testnet: Chain | undefined;
};

type ChainInformation = {
    chain: Chain;
    icon: React.ReactNode;
};

// it is important to keep sepolia as first chain in this list
const testnetNetworks: Chain[] = [
    sepolia,
    filecoinCalibration,
    arbitrumSepolia,
    avalancheFuji,
];

// it is important to keep mainnet as first chain in this list
const mainnetNetworks: Chain[] = [
    mainnet,
    filecoin,
    arbitrum,
    avalanche,
    polygonZkEvm,
];

const chainPairs: ChainPair[] = [
    { mainnet: mainnet, testnet: sepolia },
    { mainnet: filecoin, testnet: filecoinCalibration },
    { mainnet: arbitrum, testnet: arbitrumSepolia },
    { mainnet: avalanche, testnet: avalancheFuji },
    { mainnet: polygonZkEvm, testnet: undefined },
];

export const getSupportedNetworks = () => {
    return isProdEnv()
        ? mainnetNetworks.concat(testnetNetworks)
        : testnetNetworks;
};

export const isTestnetChain = (chainId: number): boolean => {
    return testnetNetworks.some(network => network.id === chainId);
};

export const getAnalogousChain = (
    currentChainId: number,
    toTestnet: boolean,
    supportedChains: number[]
): Chain => {
    let chain: Chain | undefined;

    const pair = chainPairs.find(
        p => p.mainnet.id === currentChainId || p.testnet?.id === currentChainId
    );

    if (pair) {
        chain = toTestnet ? pair.testnet ?? testnetNetworks[0] : pair.mainnet;
    }

    if (chain && supportedChains.includes(chain.id)) {
        return chain;
    }

    const fallbackChain = toTestnet ? testnetNetworks[0] : mainnetNetworks[0];
    return fallbackChain;
};

export const SupportedChainsList: ChainInformation[] = [
    {
        chain: mainnet,
        icon: (
            <Ethereum className='h-4 w-4 rounded-full tablet:h-5 tablet:w-5' />
        ),
    },
    {
        chain: filecoin,
        icon: (
            <Filecoin className='h-4 w-4 rounded-full tablet:h-5 tablet:w-5' />
        ),
    },
    {
        chain: arbitrum,
        icon: (
            <Arbitrum className='h-4 w-4 rounded-full tablet:h-5 tablet:w-5' />
        ),
    },
    {
        chain: avalanche,
        icon: (
            <Avalanche className='h-4 w-4 rounded-full tablet:h-5 tablet:w-5' />
        ),
    },
    {
        chain: polygonZkEvm,
        icon: (
            <Polygon className='h-4 w-4 rounded-full tablet:h-5 tablet:w-5' />
        ),
    },
    {
        chain: sepolia,
        icon: (
            <Ethereum className='h-4 w-4 rounded-full tablet:h-5 tablet:w-5' />
        ),
    },
    {
        chain: filecoinCalibration,
        icon: (
            <Filecoin className='h-4 w-4 rounded-full tablet:h-5 tablet:w-5' />
        ),
    },
    {
        chain: arbitrumSepolia,
        icon: (
            <Arbitrum className='h-4 w-4 rounded-full tablet:h-5 tablet:w-5' />
        ),
    },
    {
        chain: avalancheFuji,
        icon: (
            <Avalanche className='h-4 w-4 rounded-full tablet:h-5 tablet:w-5' />
        ),
    },
];
