export const MAX_COVERAGE = 10000;
export const ZERO_BI = BigInt(0);

type InputValue = bigint | number | string;

export class CollateralCalculator {
    static toNumber(value: InputValue): number {
        if (typeof value === 'number') return value;
        if (typeof value === 'bigint') return Number(value);
        return Number(value || 0);
    }

    static calculatePercentage(value: InputValue, total: InputValue): number {
        const v = this.toNumber(value);
        const t = this.toNumber(total);
        return t === 0 ? 0 : (v / t) * 100;
    }

    static calculateCollateralRatio(
        collateralValue: InputValue,
        borrowedValue: InputValue
    ): number {
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
        const normalizedThreshold =
            threshold > 1000 ? threshold / 100 : threshold;
        return (borrow * normalizedThreshold) / 100;
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

        const normalizedCoverage = cov > 100 ? cov / 100 : cov;
        if (threshold <= normalizedCoverage) return 0;

        const used = total - unused;
        const result = total * (threshold / 100) - used;
        return Math.max(0, result);
    }

    static calculateCollateralThreshold(
        liquidationThresholdRate: InputValue
    ): number {
        const rate = this.toNumber(liquidationThresholdRate);
        return rate === 0 ? 0 : 1000000 / rate;
    }
}
