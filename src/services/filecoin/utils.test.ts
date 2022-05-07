import { Network } from '@glif/filecoin-address';
import {
    FILSCAN_API_URL,
    getBlockExplorerUrl,
    getFilecoinChainId,
    getFilecoinNetwork,
} from './utils';

describe('Filecoin ChainId ID', () => {
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

describe('Block explorer', () => {
    it('should return the mainnet url when the network is MAINNET', () => {
        expect(getBlockExplorerUrl(Network.MAIN, '0x0')).toEqual(
            'https://filscan.io/address/general?address=0x0'
        );
    });

    it('should return the testnet url when the network is TESTNET', () => {
        expect(getBlockExplorerUrl(Network.TEST, '0x0')).toEqual(
            'https://calibration.filscan.io/address/general?address=0x0'
        );
    });
});

describe('Filscan api url', () => {
    it('should return the mainnet api url when the network is MAINNET', () => {
        expect(FILSCAN_API_URL[Network.MAIN]).toEqual(
            'http://api.node.glif.io/rpc/v0'
        );
    });

    it('should return the testnet api url when the network is MAINNET', () => {
        expect(FILSCAN_API_URL[Network.TEST]).toEqual(
            'https://calibration.node.glif.io/rpc/v0'
        );
    });
});
