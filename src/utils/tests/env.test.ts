import {
    Environment,
    getAmplitudeApiKey,
    getCommitHash,
    getEnvironment,
    getEthereumBlockTimer,
    getEthereumChainId,
    getEthereumNetwork,
    getRpcEndpoint,
    getUseCommitHash,
} from 'src/utils';

describe('getEthereumNetwork', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_ETHEREUM_NETWORK = 'sepolia';
        const network = getEthereumNetwork();
        expect(network).toBe('sepolia');
        expect(typeof network).toBe('string');
    });

    it('should throw error if variable is not set', () => {
        process.env.NEXT_PUBLIC_ETHEREUM_NETWORK = '';
        expect(() => getEthereumNetwork()).toThrowError(
            'NEXT_PUBLIC_ETHEREUM_NETWORK is not set'
        );
    });
});

describe('getEthereumChainId ', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_ETHEREUM_CHAIN_ID = '5';
        const chainId = getEthereumChainId();
        expect(chainId).toBe(5);
        expect(typeof chainId).toBe('number');
    });

    it('should throw error if variable is not set', () => {
        process.env.NEXT_PUBLIC_ETHEREUM_CHAIN_ID = '';
        expect(() => getEthereumChainId()).toThrowError(
            'NEXT_PUBLIC_ETHEREUM_CHAIN_ID is not set'
        );
    });
});

describe('getRpcEndpoint', () => {
    beforeEach(() => {
        process.env.NEXT_PUBLIC_ETHEREUM_NETWORK = 'sepolia';
        process.env.NEXT_PUBLIC_ALCHEMY_API_KEY = 'test';
    });

    it('should return rpc endpoint', () => {
        const network = getRpcEndpoint();
        expect(network).toBe(`https://eth-sepolia.g.alchemy.com/v2/test`);
    });

    it('should throw error if NEXT_PUBLIC_ETHEREUM_NETWORK is not set', () => {
        process.env.NEXT_PUBLIC_ETHEREUM_NETWORK = '';
        expect(() => getRpcEndpoint()).toThrowError(
            'NEXT_PUBLIC_ETHEREUM_NETWORK is not set'
        );
    });

    it('should throw error if NEXT_PUBLIC_ALCHEMY_API_KEY is not set', () => {
        process.env.NEXT_PUBLIC_ALCHEMY_API_KEY = '';
        expect(() => getRpcEndpoint()).toThrowError(
            'NEXT_PUBLIC_ALCHEMY_API_KEY is not set'
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

describe('getEthereumBlockTimer', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_ETHEREUM_BLOCK_TIMER = '10000';
        const timer = getEthereumBlockTimer();
        expect(timer).toBe(10000);
        expect(typeof timer).toBe('number');
    });

    it('should return 10000 if variable is not set', () => {
        process.env.NEXT_PUBLIC_ETHEREUM_BLOCK_TIMER = '';
        const spy = jest.spyOn(console, 'warn').mockImplementation();

        const timer = getEthereumBlockTimer();
        expect(timer).toBe(10000);
        expect(typeof timer).toBe('number');
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

describe('getUseCommitHash', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_USE_COMMIT_HASH = 'true';
        const useCommitHash = getUseCommitHash();
        expect(useCommitHash).toBe(true);
        expect(typeof useCommitHash).toBe('boolean');
    });

    it('should return false if variable is not set', () => {
        process.env.NEXT_PUBLIC_USE_COMMIT_HASH = '';
        const useCommitHash = getUseCommitHash();
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
