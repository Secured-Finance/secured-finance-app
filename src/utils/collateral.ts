export const MAX_COVERAGE = 10000;
export const ZERO_BI = BigInt(0);

export class CollateralCalculator {
    static calculatePercentage(value: bigint, total: bigint): bigint {
        return total === ZERO_BI ? ZERO_BI : (value * BigInt(100)) / total;
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
        return (borrowAmount * collateralThreshold) / 100;
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
        if (collateralThreshold <= coverage) return 0;
        const threshold = collateralThreshold / 100;
        const usedAmount = totalCollateral - totalUnusedCollateralAmount;
        return totalCollateral * threshold - usedAmount;
    }
}
