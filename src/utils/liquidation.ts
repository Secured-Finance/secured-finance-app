import { FINANCIAL_CONSTANTS } from '../config/constants';

const LIQUIDATION_CONSTANTS = {
    // Used for threshold rate conversion (1M basis points)
    THRESHOLD_RATE_DIVISOR: 1_000_000,
    // Percentage base for liquidation price calculation
    PERCENTAGE_BASE: FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR,
    // Risk thresholds in percentage
    RISK_THRESHOLDS: {
        LOW_MAX: 40,
        MEDIUM_MAX: 60,
        HIGH_MAX: 80,
    },
    // Risk level colors
    RISK_COLORS: {
        LOW: 'text-secondary-500',
        MEDIUM: 'text-warning-500',
        HIGH: 'text-error-300',
        VERY_HIGH: 'text-error-500',
    },
    // Risk level labels
    RISK_LABELS: {
        LOW: 'Low',
        MEDIUM: 'Medium',
        HIGH: 'High',
        VERY_HIGH: 'Very High',
    },
} as const;

type LiquidationRiskLevel = 'Low' | 'Medium' | 'High' | 'Very High';

interface LiquidationRiskInfo {
    color: string;
    risk: LiquidationRiskLevel;
}

export class LiquidationCalculator {
    /**
     * Calculates liquidation threshold from threshold rate
     * @param liquidationThresholdRate - Rate in basis points (e.g., 12500 = 80%)
     * @returns Liquidation threshold percentage
     */
    static getLiquidationThreshold(liquidationThresholdRate: number): number {
        return liquidationThresholdRate === 0
            ? 0
            : LIQUIDATION_CONSTANTS.THRESHOLD_RATE_DIVISOR /
                  liquidationThresholdRate;
    }

    /**
     * Determines risk level and color based on liquidation percentage
     * @param liquidationPercentage - Current liquidation percentage
     * @returns Risk information with color and level
     */
    static getLiquidationRiskInfo(
        liquidationPercentage: number
    ): LiquidationRiskInfo {
        const { RISK_THRESHOLDS, RISK_COLORS, RISK_LABELS } =
            LIQUIDATION_CONSTANTS;

        switch (true) {
            case liquidationPercentage <= RISK_THRESHOLDS.LOW_MAX:
                return {
                    color: RISK_COLORS.LOW,
                    risk: RISK_LABELS.LOW,
                };
            case liquidationPercentage <= RISK_THRESHOLDS.MEDIUM_MAX:
                return {
                    color: RISK_COLORS.MEDIUM,
                    risk: RISK_LABELS.MEDIUM,
                };
            case liquidationPercentage <= RISK_THRESHOLDS.HIGH_MAX:
                return {
                    color: RISK_COLORS.HIGH,
                    risk: RISK_LABELS.HIGH,
                };
            default:
                return {
                    color: RISK_COLORS.VERY_HIGH,
                    risk: RISK_LABELS.VERY_HIGH,
                };
        }
    }
}
