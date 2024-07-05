import { mainnet, sepolia } from 'viem/chains';
import { getSupportedNetworks } from './networks';

describe.skip('networks', () => {
    it('should have three testnet supported networks', () => {
        const supportedNetworks = getSupportedNetworks();
        expect(supportedNetworks).toHaveLength(4);
        expect(supportedNetworks[0]).toEqual(sepolia); // sepolia should be first network
    });

    it('should have four testnet and five mainnet supported networks', () => {
        process.env.SF_ENV = 'production';
        const supportedNetworks = getSupportedNetworks();
        expect(supportedNetworks).toHaveLength(9);
        expect(supportedNetworks[0]).toEqual(mainnet); // mainnet should be first network
    });
});
