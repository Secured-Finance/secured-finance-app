import {
    Environment,
    getAmplitudeApiKey,
    getCommitHash,
    getEnvironment,
    getMainnetChainId,
    getSupportedChainIds,
    getSupportedNetworks,
    getUsePackageVersion,
    getWalletConnectId,
} from 'src/utils';

describe('getMainnetChainId', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_MAINNET_CHAIN_ID = '1';
        const network = getMainnetChainId();
        expect(network).toBe(1);
        expect(typeof network).toBe('number');
    });

    it('should throw error if variable is not set', () => {
        process.env.NEXT_PUBLIC_MAINNET_CHAIN_ID = '';
        expect(() => getMainnetChainId()).toThrowError(
            'NEXT_PUBLIC_MAINNET_CHAIN_ID is not set'
        );
    });
});

describe('getSupportedNetworks', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_SUPPORTED_NETWORKS = 'mainnet,sepolia';
        const networks = getSupportedNetworks();
        expect(networks.length).toBe(2);
        expect(networks[0]).toBe('mainnet');
        expect(typeof networks[0]).toBe('string');
        expect(networks[1]).toBe('sepolia');
        expect(typeof networks[1]).toBe('string');
    });

    it('should throw error if variable is not set', () => {
        process.env.NEXT_PUBLIC_SUPPORTED_NETWORKS = '';
        expect(() => getSupportedNetworks()).toThrowError(
            'NEXT_PUBLIC_SUPPORTED_NETWORKS is not set'
        );
    });
});

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
