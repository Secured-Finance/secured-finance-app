import { BigNumber as BigNumberJS } from 'bignumber.js';
import { BigNumber } from 'ethers';

const TEN_BN = new BigNumberJS(10);

export const getFullDisplayBalanceNumber = (
    value: BigNumber,
    decimals = 18
) => {
    const balance = new BigNumberJS(value.toString());
    return balance.dividedBy(TEN_BN.pow(decimals)).toNumber();
};

export const getETHPrice = (amount: number, price: number) => {
    return new BigNumberJS(amount.toString()).multipliedBy(price).toNumber();
};
