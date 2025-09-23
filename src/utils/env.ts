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

export const getSubgraphUrl = (chainId: number): string | undefined => {
    if (chainId === 314) {
        return process.env.NEXT_PUBLIC_SUBGRAPH_URL_314;
    } else {
        return undefined;
    }
};

export const getStablecoinAppUrl = (): string => {
    const stablecoinAppUrl = process.env.NEXT_PUBLIC_STABLECOIN_APP_URL;
    assert(stablecoinAppUrl, 'NEXT_PUBLIC_STABLECOIN_APP_URL is not set');
    return stablecoinAppUrl;
};

export const getShowStablecoinAppUrl = () => {
    const NEXT_PUBLIC_SHOW_STABLECOIN_APP_URL =
        process.env.NEXT_PUBLIC_SHOW_STABLECOIN_APP_URL;
    if (!NEXT_PUBLIC_SHOW_STABLECOIN_APP_URL) {
        return false;
    }
    return NEXT_PUBLIC_SHOW_STABLECOIN_APP_URL === 'true';
};

export const getReferralMessage = (): string => {
    return process.env.NEXT_PUBLIC_REFERRAL_MESSAGE || '';
};

export const getSquidWidgetIntegratorId = () => {
    const SQUID_WIDGET_INTEGRATOR_ID =
        process.env.NEXT_PUBLIC_SQUID_WIDGET_INTEGRATOR_ID;

    if (!SQUID_WIDGET_INTEGRATOR_ID) {
        return '';
    }

    return SQUID_WIDGET_INTEGRATOR_ID;
};

export const getGoogleAnalyticsTag = () => {
    const NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG =
        process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG;

    if (!NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG) {
        // eslint-disable-next-line no-console
        console.warn(
            'Google Analytics Tag is not set: No analytics will be sent'
        );
        return '';
    }

    return NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG;
};

// Feature flags for wagmi hook migration
export const getWagmiHookFlag = (): boolean => {
    const NEXT_PUBLIC_USE_WAGMI_HOOKS = process.env.NEXT_PUBLIC_USE_WAGMI_HOOKS;

    if (!NEXT_PUBLIC_USE_WAGMI_HOOKS) {
        return false;
    }

    return NEXT_PUBLIC_USE_WAGMI_HOOKS === 'true';
};
