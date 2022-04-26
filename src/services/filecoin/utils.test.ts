import { Network } from '@glif/filecoin-address';
import { getFilecoinChainId, getFilecoinNetwork } from './utils';

describe('Filecoin Chaid ID', () => {
    it('should return the test chain id when the network is TESTNET', () => {
        expect(getFilecoinChainId(Network.TEST)).toEqual(1);
    });

    it('should return the MAINNET chain id when the network is MAINNET', () => {
        expect(getFilecoinChainId(Network.MAIN)).toEqual(461);
    });
});

describe('Filecoin network', () => {
    it('should be set from the .env files', () => {
        expect(getFilecoinNetwork()).toEqual(Network.TEST);
    });
});
