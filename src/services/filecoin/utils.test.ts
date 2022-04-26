import { Network } from '@glif/filecoin-address';
import {
    getBlockExporerUrl,
    getFilecoinChainId,
    getFilecoinNetwork,
} from './utils';

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

describe('Block exporer', () => {
    it('should return the mainnet url when the network is MAINNET', () => {
        expect(getBlockExporerUrl(Network.MAIN, '0x0')).toEqual(
            'https://filscan.io/address/general?address=0x0'
        );
    });

    it('should return the testnet url when the network is TESTNET', () => {
        expect(getBlockExporerUrl(Network.TEST, '0x0')).toEqual(
            'https://calibration.filscan.io/address/general?address=0x0'
        );
    });
});
