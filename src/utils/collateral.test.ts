import { CollateralCalculator } from './collateral';

const ONE_ETH = BigInt('1000000000000000000');
const TWO_ETH = BigInt('2000000000000000000');
const ZERO_ETH = BigInt('0');

describe('Collateral Functions', () => {
    describe('calculatePercentage', () => {
        it('should compute the percentage', () => {
            expect(
                CollateralCalculator.calculatePercentage(ONE_ETH, TWO_ETH)
            ).toEqual(50);
        });

        it('should return 0 when total is zero', () => {
            expect(
                CollateralCalculator.calculatePercentage(ONE_ETH, ZERO_ETH)
            ).toEqual(0);
        });
    });

    describe('calculateAvailableToBorrow', () => {
        it('should compute the available amount to borrow with a collateral threshold of 80%', () => {
            expect(
                CollateralCalculator.calculateAvailableToBorrow(
                    1000,
                    1000,
                    0,
                    80
                )
            ).toEqual(800);
            expect(
                CollateralCalculator.calculateAvailableToBorrow(
                    1000,
                    900,
                    10,
                    80
                )
            ).toEqual(700);
            expect(
                CollateralCalculator.calculateAvailableToBorrow(
                    1000,
                    800,
                    20,
                    80
                )
            ).toEqual(600);
            expect(
                CollateralCalculator.calculateAvailableToBorrow(
                    1000,
                    700,
                    30,
                    80
                )
            ).toEqual(500);
            expect(
                CollateralCalculator.calculateAvailableToBorrow(
                    1000,
                    600,
                    40,
                    80
                )
            ).toEqual(400);
            expect(
                CollateralCalculator.calculateAvailableToBorrow(
                    1000,
                    500,
                    50,
                    80
                )
            ).toEqual(300);
            expect(
                CollateralCalculator.calculateAvailableToBorrow(
                    1000,
                    400,
                    60,
                    80
                )
            ).toEqual(200);
            expect(
                CollateralCalculator.calculateAvailableToBorrow(
                    1000,
                    300,
                    70,
                    80
                )
            ).toEqual(100);
            expect(
                CollateralCalculator.calculateAvailableToBorrow(
                    1000,
                    200,
                    80,
                    80
                )
            ).toEqual(0);
        });

        it('should return 0 if coverage is over threshold', () => {
            expect(
                CollateralCalculator.calculateAvailableToBorrow(
                    1000,
                    150,
                    85,
                    80
                )
            ).toEqual(0);
        });
    });

    describe('calculateRequiredCollateral', () => {
        it('should calculate required collateral correctly', () => {
            expect(
                CollateralCalculator.calculateRequiredCollateral(1000, 80)
            ).toBe(800);
            expect(
                CollateralCalculator.calculateRequiredCollateral(500, 120)
            ).toBe(600);
            expect(
                CollateralCalculator.calculateRequiredCollateral(2000, 75)
            ).toBe(1500);
        });

        it('should handle zero borrow amount', () => {
            expect(
                CollateralCalculator.calculateRequiredCollateral(0, 80)
            ).toBe(0);
        });

        it('should handle zero threshold', () => {
            expect(
                CollateralCalculator.calculateRequiredCollateral(1000, 0)
            ).toBe(0);
        });
    });

    describe('calculateCollateralThreshold', () => {
        it('should calculate collateral threshold correctly', () => {
            expect(
                CollateralCalculator.calculateCollateralThreshold(12500)
            ).toBe(80);
            expect(
                CollateralCalculator.calculateCollateralThreshold(10000)
            ).toBe(100);
        });

        it('should return 0 when liquidation threshold rate is 0', () => {
            expect(CollateralCalculator.calculateCollateralThreshold(0)).toBe(
                0
            );
        });
    });
});
