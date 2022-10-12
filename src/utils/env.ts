import assert from 'assert';

export const getEthereumNetwork = (): string => {
    const network = process.env.NEXT_PUBLIC_ETHEREUM_NETWORK;
    assert(network, 'NEXT_PUBLIC_ETHEREUM_NETWORK is not set');
    return network;
};

export const getEthereumChainId = (): number => {
    const chainId = process.env.NEXT_PUBLIC_ETHEREUM_CHAIN_ID;
    assert(chainId, 'NEXT_PUBLIC_ETHEREUM_CHAIN_ID is not set');
    return parseInt(chainId, 10);
};

export const getRpcEndpoint = () => {
    const NEXT_PUBLIC_ETHEREUM_NETWORK = getEthereumNetwork();
    const NEXT_PUBLIC_ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
    assert(
        NEXT_PUBLIC_ALCHEMY_API_KEY,
        'NEXT_PUBLIC_ALCHEMY_API_KEY is not set'
    );

    return `https://eth-${NEXT_PUBLIC_ETHEREUM_NETWORK}.g.alchemy.com/v2/${NEXT_PUBLIC_ALCHEMY_API_KEY}`;
};
