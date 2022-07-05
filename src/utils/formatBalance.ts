import BigNumber from 'bignumber.js';
import { usdFormat } from '.';

const TEN_BN = new BigNumber(10);

export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
    const displayBalance = balance.dividedBy(TEN_BN.pow(decimals));
    return displayBalance.toNumber();
};

export const getBalanceBigNumber = (balance: BigNumber, decimals = 18) => {
    return balance.dividedBy(TEN_BN.pow(decimals));
};

export const getDisplayBalance = (balance: BigNumber, decimals = 18) => {
    const displayBalance = balance.dividedBy(TEN_BN.pow(decimals));
    if (displayBalance.lt(1)) {
        return displayBalance.toPrecision(1);
    } else {
        return displayBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
};

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => {
    return balance.dividedBy(TEN_BN.pow(decimals)).toFixed();
};

export const getFullDisplayBalanceNumber = (balance: number, decimals = 18) => {
    return new BigNumber(balance).dividedBy(TEN_BN.pow(decimals)).toNumber();
};

export const getUSDFormatBalanceNumber = (balance: number) => {
    return usdFormat(getFullDisplayBalanceNumber(balance));
};
