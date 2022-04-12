import BigNumber from 'bignumber.js';
export * from './currencies';
export * from './terms';
export * from './formatAddress';
export * from './formatBalance';
export * from './formatNumbers';
export * from './formatDate';
export * from './generateID';
export * from './strings';

export const bnToDec = (bn: BigNumber, decimals = 18): number => {
    return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber();
};

export const decToBn = (dec: number, decimals = 18) => {
    return new BigNumber(dec).multipliedBy(new BigNumber(10).pow(decimals));
};
