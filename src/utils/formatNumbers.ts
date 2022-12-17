import { BigNumber, FixedNumber } from 'ethers';
import { LoanValue } from './entities';

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

export const percentFormat = (
    number: number,
    dividedBy = 100,
    minimumFractionDigits = 0,
    maximumFractionDigits = 2
) => {
    const value = dividedBy === 0 ? 0 : number / dividedBy;
    return Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(value);
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

export const formatLoanValue = (value: LoanValue, type: 'price' | 'rate') => {
    if (type === 'price') {
        return (value.price / 100).toFixed(2).toString();
    } else {
        return percentFormat(value.apy.toNormalizedNumber(), 100, 2, 2);
    }
};
