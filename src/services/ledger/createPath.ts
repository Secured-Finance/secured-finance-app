import { MAINNET_PATH_CODE, TESTNET_PATH_CODE } from './constants';

const createPath: (networkCode: number, i: number) => string = (
    networkCode,
    i
) => {
    if (networkCode !== MAINNET_PATH_CODE && networkCode !== TESTNET_PATH_CODE)
        throw new Error('Invalid network code passed');
    return `m/44'/${networkCode}'/0'/0/${i}`;
};

export default createPath;
