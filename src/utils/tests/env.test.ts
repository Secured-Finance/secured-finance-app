import {
    Environment,
    getAmplitudeApiKey,
    getCommitHash,
    getEnvironment,
    getGraphqlServerUrl,
    getNonSubgraphSupportedChainIds,
    getReferralMessage,
    getShowStablecoinAppUrl,
    getStablecoinAppUrl,
    getSubgraphUrl,
    getSupportedChainIds,
    getUsePackageVersion,
    getWalletConnectId,
} from 'src/utils';

describe('getSupportedChainIds ', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_SUPPORTED_CHAIN_IDS = '5,11155111';
        const chainIds = getSupportedChainIds();
        expect(chainIds.length).toBe(2);
        expect(chainIds[0]).toBe(5);
        expect(typeof chainIds[0]).toBe('number');
        expect(chainIds[1]).toBe(11155111);
        expect(typeof chainIds[1]).toBe('number');
    });

    it('should throw error if variable is not set', () => {
        process.env.NEXT_PUBLIC_SUPPORTED_CHAIN_IDS = '';
        expect(() => getSupportedChainIds()).toThrowError(
            'NEXT_PUBLIC_SUPPORTED_CHAIN_IDS is not set'
        );
    });
});

describe('getNonSubgraphSupportedChainIds ', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_NON_SUBGRAPH_SUPPORTED_CHAIN_IDS = '314,314159';
        const chainIds = getNonSubgraphSupportedChainIds();
        expect(chainIds.length).toBe(2);
        expect(chainIds[0]).toBe(314);
        expect(typeof chainIds[0]).toBe('number');
        expect(chainIds[1]).toBe(314159);
        expect(typeof chainIds[1]).toBe('number');
    });

    it('should return empty array if variable is not set', () => {
        process.env.NEXT_PUBLIC_NON_SUBGRAPH_SUPPORTED_CHAIN_IDS = '';
        const chainIds = getNonSubgraphSupportedChainIds();
        expect(chainIds.length).toBe(0);
    });
});

describe('getWalletConnectId', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_WALLET_CONNECT_ID = 'test';
        const walletConnectId = getWalletConnectId();
        expect(walletConnectId).toBe('test');
        expect(typeof walletConnectId).toBe('string');
    });

    it('should throw error if variable is not set', () => {
        process.env.NEXT_PUBLIC_WALLET_CONNECT_ID = '';
        expect(() => getWalletConnectId()).toThrowError(
            'NEXT_PUBLIC_WALLET_CONNECT_ID is not set'
        );
    });
});

describe('getAmplitudeApiKey', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY = 'test';
        const apiKey = getAmplitudeApiKey();
        expect(apiKey).toBe('test');
        expect(typeof apiKey).toBe('string');
    });

    it('should return empty string if variable is not set', () => {
        process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY = '';
        const spy = jest.spyOn(console, 'warn').mockImplementation();

        const apiKey = getAmplitudeApiKey();
        expect(apiKey).toBe('');
        expect(typeof apiKey).toBe('string');
        expect(spy).toHaveBeenCalled();
    });
});

describe('getEnvironment', () => {
    it('should return the value of the environment variable', () => {
        process.env.SF_ENV = 'testnet';
        const env = getEnvironment();
        expect(env).toBe('testnet');
        expect(typeof env).toBe('string');
    });

    it('should return development if variable is not set', () => {
        process.env.SF_ENV = '';
        const spy = jest.spyOn(console, 'warn').mockImplementation();

        const env = getEnvironment();
        expect(env).toBe(Environment.DEVELOPMENT);
        expect(typeof env).toBe('string');
        expect(spy).toHaveBeenCalled();
    });
});

describe('getUsePackageVersion', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_USE_PACKAGE_VERSION = 'true';
        const useCommitHash = getUsePackageVersion();
        expect(useCommitHash).toBe(true);
        expect(typeof useCommitHash).toBe('boolean');
    });

    it('should return false if variable is not set', () => {
        process.env.NEXT_PUBLIC_USE_PACKAGE_VERSION = '';
        const useCommitHash = getUsePackageVersion();
        expect(useCommitHash).toBe(false);
        expect(typeof useCommitHash).toBe('boolean');
    });
});

describe('getCommitHash', () => {
    it('should return the value of the environment variable', () => {
        process.env.COMMIT_HASH = 'test';
        const commitHash = getCommitHash();
        expect(commitHash).toBe('test');
        expect(typeof commitHash).toBe('string');
    });

    it('should return empty string if variable is not set', () => {
        process.env.COMMIT_HASH = '';
        const spy = jest.spyOn(console, 'warn').mockImplementation();
        const commitHash = getCommitHash();
        expect(commitHash).toBe('');
        expect(typeof commitHash).toBe('string');
        expect(spy).toHaveBeenCalled();
    });
});

describe('getGraphqlServerUrl', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_GRAPHQL_SERVER_URL = 'test';
        const graphqlServerUrl = getGraphqlServerUrl();
        expect(graphqlServerUrl).toBe('test');
        expect(typeof graphqlServerUrl).toBe('string');
    });

    it('should throw error if variable is not set', () => {
        process.env.NEXT_PUBLIC_GRAPHQL_SERVER_URL = '';
        expect(() => getGraphqlServerUrl()).toThrowError(
            'NEXT_PUBLIC_GRAPHQL_SERVER_URL is not set'
        );
    });
});

describe('getSubgraphUrl', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_SUBGRAPH_URL_314 = 'test';
        const subgraphUrl = getSubgraphUrl(314);
        expect(subgraphUrl).toBe('test');
        expect(typeof subgraphUrl).toBe('string');
    });

    it('should return empty if variable is not set', () => {
        delete process.env.NEXT_PUBLIC_SUBGRAPH_URL_314;
        const subgraphUrl = getSubgraphUrl(314);
        expect(subgraphUrl).toBe(undefined);
    });

    it('should return undefined if the input is not a supported chain', () => {
        const subgraphUrl = getSubgraphUrl(1);
        expect(subgraphUrl).toBe(undefined);
    });
});

describe('getStablecoinAppUrl', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_STABLECOIN_APP_URL = 'test';
        const stablecoinAppUrl = getStablecoinAppUrl();
        expect(stablecoinAppUrl).toBe('test');
        expect(typeof stablecoinAppUrl).toBe('string');
    });

    it('should throw error if variable is not set', () => {
        process.env.NEXT_PUBLIC_STABLECOIN_APP_URL = '';
        expect(() => getStablecoinAppUrl()).toThrowError(
            'NEXT_PUBLIC_STABLECOIN_APP_URL is not set'
        );
    });
});

describe('getShowStablecoinAppUrl', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_SHOW_STABLECOIN_APP_URL = 'true';
        const showStablecoinAppUrl = getShowStablecoinAppUrl();
        expect(showStablecoinAppUrl).toBe(true);
        expect(typeof showStablecoinAppUrl).toBe('boolean');
    });

    it('should return false if variable is not set', () => {
        process.env.NEXT_PUBLIC_SHOW_STABLECOIN_APP_URL = '';
        const showStablecoinAppUrl = getShowStablecoinAppUrl();
        expect(showStablecoinAppUrl).toBe(false);
        expect(typeof showStablecoinAppUrl).toBe('boolean');
    });
});

describe('getReferralMessage', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_REFERRAL_MESSAGE = 'test';
        const referralMessage = getReferralMessage();
        expect(referralMessage).toBe('test');
        expect(typeof referralMessage).toBe('string');
    });

    it('should throw error if variable is not set', () => {
        process.env.NEXT_PUBLIC_REFERRAL_MESSAGE = '';
        expect(() => getReferralMessage()).toThrowError(
            'NEXT_PUBLIC_REFERRAL_MESSAGE is not set'
        );
    });
});
