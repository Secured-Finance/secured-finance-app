import assert from 'assert';
import { Environment } from './strings';

export const getSupportedChainIds = (): number[] => {
    const supportedChainIds = process.env.NEXT_PUBLIC_SUPPORTED_CHAIN_IDS;
    assert(supportedChainIds, 'NEXT_PUBLIC_SUPPORTED_CHAIN_IDS is not set');
    return supportedChainIds.split(',').map(n => parseInt(n, 10));
};

export const getNonSubgraphSupportedChainIds = (): number[] => {
    const nonSupportedChainIds =
        process.env.NEXT_PUBLIC_NON_SUBGRAPH_SUPPORTED_CHAIN_IDS;
    return !!nonSupportedChainIds
        ? nonSupportedChainIds.split(',').map(n => parseInt(n, 10))
        : [];
};

export const getWalletConnectId = () => {
    const walletConnectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID;
    assert(walletConnectId, 'NEXT_PUBLIC_WALLET_CONNECT_ID is not set');
    return walletConnectId;
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

export const getGraphqlServerUrl = (): string => {
    const graphqlServerUrl = process.env.NEXT_PUBLIC_GRAPHQL_SERVER_URL;
    assert(graphqlServerUrl, 'NEXT_PUBLIC_GRAPHQL_SERVER_URL is not set');
    return graphqlServerUrl;
};

export const getReferralMessage = (): string => {
    const referralMessage = process.env.NEXT_PUBLIC_REFERRAL_MESSAGE;
    assert(referralMessage, 'NEXT_PUBLIC_REFERRAL_MESSAGE is not set');
    return referralMessage;
};

export const getReferralHashtags = (): string => {
    const referralHashtags = process.env.NEXT_PUBLIC_REFERRAL_HASHTAGS;
    assert(referralHashtags, 'NEXT_PUBLIC_REFERRAL_HASHTAGS is not set');
    return referralHashtags;
};

export const getSubgraphUrl = (chainId: number): string | undefined => {
    if (chainId === 314) {
        return process.env.NEXT_PUBLIC_SUBGRAPH_URL_314;
    } else {
        return undefined;
    }
};
