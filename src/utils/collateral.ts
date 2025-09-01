const PERCENTAGE_BASE = 100;
const LIQUIDATION_RATE_DIVISOR = 1000000;
const ZERO = 0;

export const MAX_COVERAGE = 10000;
export const ZERO_BI = BigInt(0);

type InputValue = bigint | number | string;

export class CollateralCalculator {
    static toNumber(value: InputValue): number {
        return Number(value || ZERO);
    }

    static calculatePercentage(value: InputValue, total: InputValue): number {
        const v = this.toNumber(value);
        const t = this.toNumber(total);
        return t === ZERO ? ZERO : (v / t) * PERCENTAGE_BASE;
    }

    static calculateRequiredCollateral(
        borrowAmount: InputValue,
        collateralThreshold: InputValue
    ): number {
        const borrow = this.toNumber(borrowAmount);
        const threshold = this.toNumber(collateralThreshold);
        return (borrow * threshold) / PERCENTAGE_BASE;
    }

    static calculateAvailableToBorrow(
        totalCollateral: InputValue,
        totalUnusedCollateral: InputValue,
        coverage: InputValue,
        collateralThreshold: InputValue
    ): number {
        const total = this.toNumber(totalCollateral);
        const unused = this.toNumber(totalUnusedCollateral);
        const cov = this.toNumber(coverage);
        const threshold = this.toNumber(collateralThreshold);

        const coverageAsPercentage = cov / PERCENTAGE_BASE;
        if (threshold <= coverageAsPercentage) return ZERO;

        const used = total - unused;
        const result = total * (threshold / PERCENTAGE_BASE) - used;
        return Math.max(ZERO, result);
    }

    static calculateCollateralThreshold(
        liquidationThresholdRate: InputValue
    ): number {
        const rate = this.toNumber(liquidationThresholdRate);
        return rate === ZERO ? ZERO : LIQUIDATION_RATE_DIVISOR / rate;
    }
}
