import { setUpSecuredFinanceSkd } from 'src/utils';

describe('setUpSecuredFinanceSkd', () => {
    it('should return network and sfEnv', () => {
        const { network, sfEnv } = setUpSecuredFinanceSkd();
        expect(network).toBe('rinkeby');
        expect(sfEnv).toBe('development');
    });

    it('should throw error if NEXT_PUBLIC_ETHEREUM_NETWORK is not set', () => {
        process.env.NEXT_PUBLIC_ETHEREUM_NETWORK = '';
        expect(() => setUpSecuredFinanceSkd()).toThrowError(
            'NEXT_PUBLIC_ETHEREUM_NETWORK is not set'
        );
    });
});
