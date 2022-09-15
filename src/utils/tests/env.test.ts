import { getRpcEndpoint, setUpSecuredFinanceSkd } from 'src/utils';

describe('setUpSecuredFinanceSkd', () => {
    beforeEach(() => {
        process.env.NEXT_PUBLIC_ETHEREUM_NETWORK = 'rinkeby';
        process.env.NEXT_PUBLIC_ALCHEMY_API_KEY = 'test';
    });

    it('should return network', () => {
        const network = setUpSecuredFinanceSkd();
        expect(network).toBe('rinkeby');
    });

    it('should throw error if NEXT_PUBLIC_ETHEREUM_NETWORK is not set', () => {
        process.env.NEXT_PUBLIC_ETHEREUM_NETWORK = '';
        expect(() => setUpSecuredFinanceSkd()).toThrowError(
            'NEXT_PUBLIC_ETHEREUM_NETWORK is not set'
        );
    });
});

describe('getRpcEndpoint', () => {
    beforeEach(() => {
        process.env.NEXT_PUBLIC_ETHEREUM_NETWORK = 'rinkeby';
        process.env.NEXT_PUBLIC_ALCHEMY_API_KEY = 'test';
    });

    it('should return rpc endpoint', () => {
        const network = getRpcEndpoint();
        expect(network).toBe(`https://eth-rinkeby.alchemyapi.io/v2/test`);
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
