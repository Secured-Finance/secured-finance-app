import { Network } from '@glif/filecoin-address';
import assert from 'assert';
import { MAINNET_PATH_CODE, TESTNET_PATH_CODE } from '../ledger/constants';

export const MainNetPath = "m/44'/461'/0'/0/0";
export const TestNetPath = "m/44'/1'/0'/0/0";

const BLOCK_EXPLORER_URL: Record<Network, string> = {
    [Network.MAIN]: 'https://filscan.io/',
    [Network.TEST]: 'https://calibration.filscan.io/',
};

export const FIL_JSON_RPC_ENDPOINT: Record<Network, string> = {
    [Network.MAIN]: 'http://api.node.glif.io/rpc/v0',
    [Network.TEST]: 'https://api.calibration.node.glif.io/rpc/v0',
};

const BLOCK_EXPLORER_WALLET_PREFIX = 'address/general?address=';

export const getFilecoinNetwork = () => {
    assert(
        process.env.NEXT_PUBLIC_FILECOIN_NETWORK,
        'NEXT_PUBLIC_FILECOIN_NETWORK environment variable is not set'
    );
    if (process.env.NEXT_PUBLIC_FILECOIN_NETWORK.toLowerCase() === 'mainnet') {
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
