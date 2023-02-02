import {
    getAmplitudeApiKey,
    getEthereumChainId,
    getEthereumNetwork,
    getRpcEndpoint,
} from 'src/utils';

describe('getEthereumNetwork', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_ETHEREUM_NETWORK = 'goerli';
        const network = getEthereumNetwork();
        expect(network).toBe('goerli');
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
        process.env.NEXT_PUBLIC_ETHEREUM_NETWORK = 'goerli';
        process.env.NEXT_PUBLIC_ALCHEMY_API_KEY = 'test';
    });

    it('should return rpc endpoint', () => {
        const network = getRpcEndpoint();
        expect(network).toBe(`https://eth-goerli.g.alchemy.com/v2/test`);
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
