import BigNumber from 'bignumber.js';
import { usdFormat } from '.';

export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
    const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals));
    return displayBalance.toNumber();
};

export const getBalanceBigNumber = (balance: BigNumber, decimals = 18) => {
    return balance.dividedBy(new BigNumber(10).pow(decimals));
};

export const getDisplayBalance = (balance: BigNumber, decimals = 18) => {
    const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals));
    if (displayBalance.lt(1)) {
        return displayBalance.toPrecision(4);
    } else {
        return displayBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
};

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => {
    return balance.dividedBy(new BigNumber(10).pow(decimals)).toFixed();
};

export const getFullDisplayBalanceNumber = (balance: number, decimals = 18) => {
    return new BigNumber(balance)
        .dividedBy(new BigNumber(10).pow(decimals))
        .toNumber();
};

export const getUSDFormatBalanceNumber = (balance: number, decimals = 18) => {
    return usdFormat(getFullDisplayBalanceNumber(balance));
};
