import { divide } from './currencyList';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

export const MAX_COVERAGE = FINANCIAL_CONSTANTS.BPS_DIVISOR;
export const ZERO_BI = BigInt(0);
export const HUNDRED_BI = BigInt(100);

export const computeAvailableToBorrow = (
    totalCollateral: number | bigint,
    totalUnusedCollateralAmount: number | bigint,
    coverage: number | bigint,
    collateralThreshold: number | bigint
) => {
    const totalCollateralBi =
        typeof totalCollateral === 'bigint'
            ? totalCollateral
            : BigInt(Math.floor(totalCollateral));
    const totalUnusedBi =
        typeof totalUnusedCollateralAmount === 'bigint'
            ? totalUnusedCollateralAmount
            : BigInt(Math.floor(totalUnusedCollateralAmount));
    const coverageBi =
        typeof coverage === 'bigint' ? coverage : BigInt(Math.floor(coverage));
    const thresholdBi =
        typeof collateralThreshold === 'bigint'
            ? collateralThreshold
            : BigInt(Math.floor(collateralThreshold));

    if (thresholdBi <= coverageBi) return ZERO_BI;

    const usedAmount = totalCollateralBi - totalUnusedBi;
    const result =
        (totalCollateralBi * thresholdBi) /
            BigInt(FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR) -
        usedAmount;

    return result;
};

// Backward compatibility
export const computeAvailableToBorrowNumber = (
    totalCollateral: number,
    totalUnusedCollateralAmount: number,
    coverage: number,
    collateralThreshold: number
): number => {
    if (collateralThreshold <= coverage) return 0;
    const threshold = divide(
        collateralThreshold,
        FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR
    );
    const usedAmount = totalCollateral - totalUnusedCollateralAmount;
    return totalCollateral * threshold - usedAmount;
};

export const calculatePercentage = (value: bigint, total: bigint): bigint => {
    return total === ZERO_BI ? ZERO_BI : (value * HUNDRED_BI) / total;
};

export const calculatePercentageNumber = (
    value: bigint,
    total: bigint
): number => {
    return Number(calculatePercentage(value, total));
};
