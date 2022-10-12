import { getEnvVariable, getRpcEndpoint } from 'src/utils';

describe('getEnvVariable', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_ETHEREUM_NETWORK = 'goerli';
        const network = getEnvVariable('NEXT_PUBLIC_ETHEREUM_NETWORK');
        expect(network).toBe('goerli');
        expect(typeof network).toBe('string');
    });

    it('should throw error if variable is not set', () => {
        process.env.NEXT_PUBLIC_ETHEREUM_NETWORK = '';
        expect(() =>
            getEnvVariable('NEXT_PUBLIC_ETHEREUM_NETWORK')
        ).toThrowError('NEXT_PUBLIC_ETHEREUM_NETWORK is not set');
    });

    it('should cast the value to the type passed', () => {
        process.env.NEXT_PUBLIC_ETHEREUM_CHAIN_ID = '5';
        const chainId = getEnvVariable('NEXT_PUBLIC_ETHEREUM_CHAIN_ID');
        expect(chainId).toBe(5);
        expect(typeof chainId).toBe('number');
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
