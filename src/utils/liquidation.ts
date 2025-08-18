export class LiquidationCalculator {
    static calculateLiquidationThreshold(
        liquidationThresholdRate: number
    ): number {
        return liquidationThresholdRate === 0
            ? 0
            : 1000000 / liquidationThresholdRate;
    }

    static calculateLiquidationPrice(
        collateralValue: number,
        borrowedValue: number,
        liquidationThreshold: number
    ): number {
        if (collateralValue === 0) return 0;
        return (borrowedValue * liquidationThreshold) / 100 / collateralValue;
    }

    static getLiquidationRiskInfo(liquidationPercentage: number): {
        color: string;
        risk: string;
    } {
        let color: string;
        let risk: string;

        switch (true) {
            case liquidationPercentage <= 40:
                color = 'text-secondary-500';
                risk = 'Low';
                break;
            case liquidationPercentage <= 60:
                color = 'text-warning-500';
                risk = 'Medium';
                break;
            case liquidationPercentage <= 80:
                color = 'text-error-300';
                risk = 'High';
                break;
            default:
                color = 'text-error-500';
                risk = 'Very High';
                break;
        }
        return { color, risk };
    }
}
