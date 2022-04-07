import BigNumber from 'bignumber.js';
export * from './currencies';
export * from './erc20';
export * from './formatAddress';
export * from './formatBalance';
export * from './formatDate';
export * from './formatNumbers';
export * from './generateID';
export * from './terms';

export const bnToDec = (bn: BigNumber, decimals = 18): number => {
    return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber();
};

export const decToBn = (dec: number, decimals = 18): BigNumber => {
    return new BigNumber(dec).multipliedBy(new BigNumber(10).pow(decimals));
};
