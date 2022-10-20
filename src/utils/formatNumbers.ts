import { BigNumber, FixedNumber } from 'ethers';

export const usdFormat = (number: number, digits = 0) => {
    return Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        currencySign: 'accounting',
        maximumFractionDigits: digits,
    }).format(number);
};

export const usdFormatAppendUSD = (number: number, digits = 0) => {
    return `${usdFormat(number, digits)} USD`;
};

export const percentFormat = (number: number, dividedBy = 100) => {
    return number !== 0
        ? Intl.NumberFormat('en-US', {
              style: 'percent',
              maximumFractionDigits: 2,
          }).format(number / dividedBy)
        : '0%';
};

export const ordinaryFormat = (
    number: number | bigint | BigNumber | FixedNumber,
    decimals = 2
) => {
    if (number instanceof BigNumber) {
        return Intl.NumberFormat('en-US', {
            maximumFractionDigits: decimals,
        }).format(number.toBigInt());
    } else if (number instanceof FixedNumber) {
        return number.toString();
    } else {
        return Intl.NumberFormat('en-US', {
            maximumFractionDigits: decimals,
        }).format(number);
    }
};
