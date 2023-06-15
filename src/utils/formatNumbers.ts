import { BigNumber, FixedNumber } from 'ethers';
import { MAX_COVERAGE } from './collateral';
import { LoanValue } from './entities';

export const usdFormat = (
    number: number | BigNumber,
    digits = 0,
    notation: 'standard' | 'compact' = 'standard'
) => {
    let val;
    if (number instanceof BigNumber) {
        val = number.toBigInt();
    } else {
        val = number;
    }
    return Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        currencySign: 'accounting',
        maximumFractionDigits: digits,
        notation: notation,
    }).format(val);
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
    minDecimals = 0,
    maxDecimals = 2,
    notation: 'standard' | 'compact' = 'standard'
) => {
    if (number instanceof BigNumber) {
        return Intl.NumberFormat('en-US', {
            minimumFractionDigits: minDecimals,
            maximumFractionDigits: maxDecimals,
            notation: notation,
        }).format(number.toBigInt());
    } else if (number instanceof FixedNumber) {
        return number.toString();
    } else {
        return Intl.NumberFormat('en-US', {
            minimumFractionDigits: minDecimals,
            maximumFractionDigits: maxDecimals,
            notation: notation,
        }).format(number);
    }
};

export const formatWithCurrency = (
    number: number | bigint | BigNumber | FixedNumber,
    currency: string,
    decimals = 2
) => {
    return `${ordinaryFormat(number, 0, decimals)} ${currency}`;
};

export const formatLoanValue = (value: LoanValue, type: 'price' | 'rate') => {
    if (type === 'price') {
        return (value.price / 100).toFixed(2).toString();
    } else {
        return percentFormat(value.apr.toNormalizedNumber(), 100, 2, 2);
    }
};

export function formatCollateralRatio(collateral: number) {
    return percentFormat(collateral, MAX_COVERAGE, 0);
}
export const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return `${date.toLocaleDateString(
        navigator.language
    )} ${date.toLocaleTimeString(navigator.language)}`;
};

export const formatTimestampWithMonth = (timestamp: number) => {
    const date = new Date(timestamp * 1000);

    const month = new Intl.DateTimeFormat('en-US', {
        month: 'short',
    }).format(date);
    const day = date.getDate();
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-GB', { timeZone: 'UTC' });

    return `${month} ${day}, ${year} ${time}`;
};
