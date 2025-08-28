// Constants to replace magic numbers
const PERCENTAGE_BASE = 100;
const LIQUIDATION_RATE_DIVISOR = 1000000;

export const MAX_COVERAGE = 10000;
export const ZERO_BI = BigInt(0);

type InputValue = bigint | number | string;

export class CollateralCalculator {
    static toNumber(value: InputValue): number {
        return Number(value || 0);
    }

    static calculatePercentage(value: InputValue, total: InputValue): number {
        if (typeof value === 'bigint' && typeof total === 'bigint') {
            return total === ZERO_BI
                ? 0
                : Number((value * BigInt(PERCENTAGE_BASE)) / total);
        }

        const v = this.toNumber(value);
        const t = this.toNumber(total);
        return t === 0 ? 0 : (v / t) * PERCENTAGE_BASE;
    }

    static calculateCollateralRatio(
        collateralValue: InputValue,
        borrowedValue: InputValue
    ): number {
        if (
            typeof collateralValue === 'bigint' &&
            typeof borrowedValue === 'bigint'
        ) {
            return borrowedValue === ZERO_BI
                ? Infinity
                : Number(collateralValue) / Number(borrowedValue);
        }

        const collateral = this.toNumber(collateralValue);
        const borrowed = this.toNumber(borrowedValue);
        return borrowed === 0 ? Infinity : collateral / borrowed;
    }

    static calculateRequiredCollateral(
        borrowAmount: InputValue,
        collateralThreshold: InputValue
    ): number {
        const borrow = this.toNumber(borrowAmount);
        const threshold = this.toNumber(collateralThreshold);
        return (borrow * threshold) / PERCENTAGE_BASE;
    }

    static calculateLiquidationPrice(
        collateralAmount: InputValue,
        borrowedAmount: InputValue,
        collateralThreshold: InputValue
    ): number {
        const collateral = this.toNumber(collateralAmount);
        if (collateral === 0) return 0;
        const required = this.calculateRequiredCollateral(
            borrowedAmount,
            collateralThreshold
        );
        return required / collateral;
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
        if (threshold <= coverageAsPercentage) return 0;

        const used = total - unused;
        const result = total * (threshold / PERCENTAGE_BASE) - used;
        return Math.max(0, result);
    }

    static calculateCollateralThreshold(
        liquidationThresholdRate: InputValue
    ): number {
        const rate = this.toNumber(liquidationThresholdRate);
        return rate === 0 ? 0 : LIQUIDATION_RATE_DIVISOR / rate;
    }
}
