import { divide, multiply } from './currencyList';

type InputValue = bigint | number | string;

const PERCENTAGE_BASE = 100;
const ZERO = 0;
const ZERO_BI = BigInt(0);

export const calculateBarWidth = (
    value: InputValue,
    total: InputValue,
    maxWidth: number,
    minWidth: number
): number => {
    const vBig = BigInt(value || ZERO);
    const tBig = BigInt(total || ZERO);
    const percentage =
        tBig === ZERO_BI ? ZERO : multiply(divide(vBig, tBig), PERCENTAGE_BASE);
    const ratio = divide(percentage, PERCENTAGE_BASE);
    const targetWidth = multiply(ratio, maxWidth);
    return Math.min(Math.max(targetWidth, minWidth), maxWidth);
};
