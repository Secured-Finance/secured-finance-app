import { divide } from './currencyList';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

export const MAX_COVERAGE = FINANCIAL_CONSTANTS.BPS_DIVISOR;
export const ZERO_BI = BigInt(0);

export const computeAvailableToBorrow = (
    totalCollateral: number,
    totalUnusedCollateralAmount: number,
    coverage: number, // [0,100]
    collateralThreshold: number // [0,100]
) => {
    if (collateralThreshold <= coverage) return 0;
    const threshold = divide(
        collateralThreshold,
        FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR
    );
    const usedAmount = totalCollateral - totalUnusedCollateralAmount;
    return totalCollateral * threshold - usedAmount;
};

export const calculatePercentage = (value: bigint, total: bigint) => {
    return total === ZERO_BI ? ZERO_BI : (value * BigInt(100)) / total;
};
