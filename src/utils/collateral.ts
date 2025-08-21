export const MAX_COVERAGE = 10000;
export const ZERO_BI = BigInt(0);

export class CollateralCalculator {
    static calculatePercentage(value: bigint, total: bigint): number {
        return total === ZERO_BI ? 0 : Number((value * BigInt(100)) / total);
    }

    static calculateCollateralRatio(
        collateralValue: number,
        borrowedValue: number
    ): number {
        if (borrowedValue === 0) return Infinity;
        return (collateralValue / borrowedValue) * 100;
    }

    static calculateRequiredCollateral(
        borrowAmount: number,
        collateralThreshold: number
    ): number {
        const threshold =
            collateralThreshold > 1000
                ? collateralThreshold / 100
                : collateralThreshold;
        return (borrowAmount * threshold) / 100;
    }

    static calculateLiquidationPrice(
        collateralAmount: number,
        borrowedAmount: number,
        collateralThreshold: number,
        _currentPrice: number
    ): number {
        if (collateralAmount === 0) return 0;

        const requiredCollateralValue = this.calculateRequiredCollateral(
            borrowedAmount,
            collateralThreshold
        );

        return requiredCollateralValue / collateralAmount || 0;
    }

    static calculateAvailableToBorrow(
        totalCollateral: number,
        totalUnusedCollateralAmount: number,
        coverage: number,
        collateralThreshold: number
    ): number {
        const normalizedCoverage = coverage > 100 ? coverage / 100 : coverage;
        if (collateralThreshold <= normalizedCoverage) return 0;
        const threshold = collateralThreshold / 100;
        const usedAmount = totalCollateral - totalUnusedCollateralAmount;
        return totalCollateral * threshold - usedAmount;
    }
}
