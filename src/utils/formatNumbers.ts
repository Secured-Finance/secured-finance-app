import { FilecoinNumber } from '@glif/filecoin-number';
import { BigNumber, ethers, FixedNumber } from 'ethers';

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
        : '0 %';
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

export const formatInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let checkIfNum;
    if (e.key !== undefined) {
        checkIfNum =
            e.key === 'e' || e.key === '.' || e.key === '+' || e.key === '-';
    }
    return checkIfNum && e.preventDefault();
};

export const formatUsdAmount = (number: number): string => {
    return (number * 100).toFixed(0);
};

export const formatFixedNumber = (value: FixedNumber, decimals = 2): string => {
    return value.round(decimals).toString();
};

export const formatFilecoin = (
    number: number,
    unit: 'fil' | 'picofil' | 'attofil',
    toUnit: 'fil' | 'picofil' | 'attofil' = 'fil'
) => {
    const filAmount = new FilecoinNumber(number, unit);
    let amount: string;
    switch (toUnit) {
        case 'fil':
            amount = filAmount.toFil();
            break;
        case 'picofil':
            amount = filAmount.toPicoFil();
            break;
        case 'attofil':
            amount = filAmount.toAttoFil();
            break;
        default:
            throw new Error(`Unknown unit: ${unit}`);
    }

    const value =
        toUnit === 'fil' && unit !== 'fil'
            ? ethers.FixedNumber.from(amount)
            : ethers.BigNumber.from(amount);

    return {
        value,
        unit: toUnit.toUpperCase(),
    };
};
