import { CollateralCalculator } from './collateral';
import { divide, multiply } from './currencyList';

type InputValue = bigint | number | string;

const PERCENTAGE_BASE = 100;

const PRECISION = 8;

export const calculateBarWidth = (
    value: InputValue,
    total: InputValue,
    maxWidth: number,
    minWidth: number
): number => {
    const percentage = CollateralCalculator.calculatePercentage(value, total);
    const ratio = divide(Number(percentage), PERCENTAGE_BASE, PRECISION);
    const calculatedWidth = multiply(ratio, maxWidth, PRECISION);

    return Math.min(Math.max(calculatedWidth, minWidth), maxWidth);
};
