import { Network } from '@glif/filecoin-address';
import { MAINNET_PATH_CODE, TESTNET_PATH_CODE } from '../ledger/constants';

export const MainNetPath = "m/44'/461'/0'/0/0";
export const TestNetPath = "m/44'/1'/0'/0/0";

const BLOCK_EXPLORER_URL: Record<Network, string> = {
    [Network.MAIN]: 'https://filscan.io/',
    [Network.TEST]: 'https://calibration.filscan.io/',
};

export const FILSCAN_API_URL: Record<Network, string> = {
    [Network.MAIN]: 'https://api.filscan.io/',
    [Network.TEST]: 'https://api.calibration.filscan.io/',
};

const BLOCK_EXPLORER_WALLET_PREFIX = 'address/general?address=';

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

export const getBlockExplorerUrl = (network: Network, wallet: string) => {
    return `${BLOCK_EXPLORER_URL[network]}${BLOCK_EXPLORER_WALLET_PREFIX}${wallet}`;
};
