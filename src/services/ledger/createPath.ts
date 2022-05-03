import { Network } from '@glif/filecoin-address';
import { getFilecoinChainId } from 'src/services/filecoin/utils';

const createPath: (network: Network, i: number) => string = (network, i) => {
    return `m/44'/${getFilecoinChainId(network)}'/0'/0/${i}`;
};

export default createPath;
