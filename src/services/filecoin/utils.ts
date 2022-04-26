import { Network } from '@glif/filecoin-address';
import { MAINNET_PATH_CODE, TESTNET_PATH_CODE } from '../ledger/constants';

export const MainNetPath = "m/44'/461'/0'/0/0";
export const TestNetPath = "m/44'/1'/0'/0/0";
export const HDWallet = 'HDWallet';
export const PKWallet = 'PrivateKeyWallet';

export const getFilecoinNetwork = () => {
    if (process.env.REACT_APP_FILECOIN_NETWORK.toLowerCase() === 'mainnet') {
        return Network.MAIN;
    } else {
        return Network.TEST;
    }
};

export const getFilecoinChainId = (network: Network) => {
    if (network === Network.MAIN) {
        return MAINNET_PATH_CODE;
    }

    return TESTNET_PATH_CODE;
};
