import BigNumber from 'bignumber.js';

const TEN_BN = new BigNumber(10);

export const getDisplayBalance = (balance: BigNumber, decimals = 18) => {
    const displayBalance = balance.dividedBy(TEN_BN.pow(decimals));
    if (displayBalance.lt(1)) {
        return displayBalance.toPrecision(1);
    } else {
        return displayBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
};

export const getFullDisplayBalanceNumber = (balance: number, decimals = 18) => {
    return new BigNumber(balance).dividedBy(TEN_BN.pow(decimals)).toNumber();
};
