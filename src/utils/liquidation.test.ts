import { LiquidationCalculator } from './liquidation';

describe('LiquidationCalculator', () => {
    describe('calculateLiquidationThreshold', () => {
        it('should calculate liquidation threshold correctly', () => {
            expect(LiquidationCalculator.getLiquidationThreshold(12500)).toBe(
                80
            );
            expect(
                LiquidationCalculator.getLiquidationThreshold(8333)
            ).toBeCloseTo(120.01, 1);
            expect(LiquidationCalculator.getLiquidationThreshold(20000)).toBe(
                50
            );
        });

        it('should return 0 when liquidationThresholdRate is 0', () => {
            expect(LiquidationCalculator.getLiquidationThreshold(0)).toBe(0);
        });
    });

    describe('calculateLiquidationPrice', () => {
        it('should calculate liquidation price correctly', () => {
            expect(
                LiquidationCalculator.calculateLiquidationPrice(1000, 500, 80)
            ).toBe(0.4);
            expect(
                LiquidationCalculator.calculateLiquidationPrice(2000, 1000, 120)
            ).toBe(0.6);
            expect(
                LiquidationCalculator.calculateLiquidationPrice(500, 400, 100)
            ).toBe(0.8);
        });

        it('should return 0 when collateral value is 0', () => {
            expect(
                LiquidationCalculator.calculateLiquidationPrice(0, 500, 80)
            ).toBe(0);
        });

        it('should handle zero borrowed value', () => {
            expect(
                LiquidationCalculator.calculateLiquidationPrice(1000, 0, 80)
            ).toBe(0);
        });
    });

    describe('getLiquidationRiskInfo', () => {
        it('should return Low risk for percentage <= 40', () => {
            const result = LiquidationCalculator.getLiquidationRiskInfo(30);
            expect(result.risk).toBe('Low');
            expect(result.color).toBe('text-secondary-500');
        });

        it('should return Medium risk for percentage 41-60', () => {
            const result = LiquidationCalculator.getLiquidationRiskInfo(50);
            expect(result.risk).toBe('Medium');
            expect(result.color).toBe('text-warning-500');
        });

        it('should return High risk for percentage 61-80', () => {
            const result = LiquidationCalculator.getLiquidationRiskInfo(70);
            expect(result.risk).toBe('High');
            expect(result.color).toBe('text-error-300');
        });

        it('should return Very High risk for percentage > 80', () => {
            const result = LiquidationCalculator.getLiquidationRiskInfo(90);
            expect(result.risk).toBe('Very High');
            expect(result.color).toBe('text-error-500');
        });

        it('should handle edge cases correctly', () => {
            expect(LiquidationCalculator.getLiquidationRiskInfo(40).risk).toBe(
                'Low'
            );
            expect(LiquidationCalculator.getLiquidationRiskInfo(60).risk).toBe(
                'Medium'
            );
            expect(LiquidationCalculator.getLiquidationRiskInfo(80).risk).toBe(
                'High'
            );
        });
    });
});
