import { BigNumber } from 'bignumber.js';

export const getETHPrice = (amount: number, price: number) => {
    return new BigNumber(amount).multipliedBy(price).toNumber();
};
