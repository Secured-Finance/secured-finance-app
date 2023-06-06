import assert from 'assert';
import { Environment } from './strings';

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

export const getAmplitudeApiKey = () => {
    const NEXT_PUBLIC_AMPLITUDE_API_KEY =
        process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;

    if (!NEXT_PUBLIC_AMPLITUDE_API_KEY) {
        // eslint-disable-next-line no-console
        console.warn('Amplitude API is not set: no analytics will be sent');
        return '';
    }

    return NEXT_PUBLIC_AMPLITUDE_API_KEY;
};

export const getEthereumBlockTimer = () => {
    const NEXT_PUBLIC_ETHEREUM_BLOCK_TIMER =
        process.env.NEXT_PUBLIC_ETHEREUM_BLOCK_TIMER;

    if (!NEXT_PUBLIC_ETHEREUM_BLOCK_TIMER) {
        // eslint-disable-next-line no-console
        console.warn(
            'NEXT_PUBLIC_ETHEREUM_BLOCK_TIMER is not set, defaulting to 10000'
        );
        return 10000;
    }

    return parseInt(NEXT_PUBLIC_ETHEREUM_BLOCK_TIMER);
};

export const getEnvironment = () => {
    const SF_ENV = process.env.SF_ENV;

    if (!SF_ENV) {
        // eslint-disable-next-line no-console
        console.warn('SF_ENV is not set, defaulting to development');
        return Environment.DEVELOPMENT;
    }

    return SF_ENV;
};

export const getUsePackageVersion = () => {
    const NEXT_PUBLIC_USE_PACKAGE_VERSION =
        process.env.NEXT_PUBLIC_USE_PACKAGE_VERSION;

    if (!NEXT_PUBLIC_USE_PACKAGE_VERSION) {
        return false;
    }

    return NEXT_PUBLIC_USE_PACKAGE_VERSION === 'true';
};

export const getCommitHash = () => {
    const NEXT_PUBLIC_COMMIT_HASH = process.env.COMMIT_HASH;

    if (!NEXT_PUBLIC_COMMIT_HASH) {
        // eslint-disable-next-line no-console
        console.warn('COMMIT_HASH is not set');
        return '';
    }

    return NEXT_PUBLIC_COMMIT_HASH;
};
