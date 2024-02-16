import { mainnet, sepolia } from 'viem/chains';
import { getSupportedNetworks } from './networks';

describe('networks', () => {
    it('should have three testnet supported networks', () => {
        const supportedNetworks = getSupportedNetworks();
        expect(supportedNetworks).toHaveLength(3);
        expect(supportedNetworks[0]).toEqual(sepolia); // sepolia should be first network
    });

    it('should have three testnet and four mainnet supported networks', () => {
        process.env.SF_ENV = 'production';
        const supportedNetworks = getSupportedNetworks();
        expect(supportedNetworks).toHaveLength(7);
        expect(supportedNetworks[0]).toEqual(mainnet); // mainnet should be first network
    });
});
