import { FINANCIAL_CONSTANTS } from '../config/constants';

const LIQUIDATION_CONSTANTS = {
    // Used for threshold rate conversion (1M basis points)
    THRESHOLD_RATE_DIVISOR: 1_000_000n,
    // Percentage base for liquidation price calculation
    PERCENTAGE_BASE: BigInt(FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR),
    // Risk thresholds in percentage
    RISK_THRESHOLDS: {
        LOW_MAX: 40n,
        MEDIUM_MAX: 60n,
        HIGH_MAX: 80n,
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
    static getLiquidationThreshold(
        liquidationThresholdRate: number | bigint
    ): bigint {
        const rateBigInt =
            typeof liquidationThresholdRate === 'number'
                ? BigInt(Math.floor(liquidationThresholdRate))
                : liquidationThresholdRate;

        return rateBigInt === 0n
            ? 0n
            : LIQUIDATION_CONSTANTS.THRESHOLD_RATE_DIVISOR / rateBigInt;
    }

    static getLiquidationThresholdNumber(
        liquidationThresholdRate: number | bigint
    ): number {
        return Number(this.getLiquidationThreshold(liquidationThresholdRate));
    }

    static getLiquidationRiskInfo(
        liquidationPercentage: number | bigint
    ): LiquidationRiskInfo {
        const { RISK_THRESHOLDS, RISK_COLORS, RISK_LABELS } =
            LIQUIDATION_CONSTANTS;

        const percentageBigInt =
            typeof liquidationPercentage === 'number'
                ? BigInt(Math.floor(liquidationPercentage))
                : liquidationPercentage;

        switch (true) {
            case percentageBigInt <= RISK_THRESHOLDS.LOW_MAX:
                return {
                    color: RISK_COLORS.LOW,
                    risk: RISK_LABELS.LOW,
                };
            case percentageBigInt <= RISK_THRESHOLDS.MEDIUM_MAX:
                return {
                    color: RISK_COLORS.MEDIUM,
                    risk: RISK_LABELS.MEDIUM,
                };
            case percentageBigInt <= RISK_THRESHOLDS.HIGH_MAX:
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
