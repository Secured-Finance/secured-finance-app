import { divide } from './currencyList';

export const MAX_COVERAGE = 10000;
export const ZERO_BI = BigInt(0);

export const computeAvailableToBorrow = (
    totalCollateral: number,
    totalUnusedCollateralAmount: number,
    coverage: number, // [0,100]
    collateralThreshold: number // [0,100]
) => {
    if (collateralThreshold <= coverage) return 0;
    const threshold = divide(collateralThreshold, 100);
    const usedAmount = totalCollateral - totalUnusedCollateralAmount;
    return totalCollateral * threshold - usedAmount;
};

export const calculatePercentage = (value: bigint, total: bigint) => {
    return total === ZERO_BI ? ZERO_BI : (value * BigInt(100)) / total;
};
