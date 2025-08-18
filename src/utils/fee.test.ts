import { FeeCalculator } from './fee';

const getMaturity = (days: number) => {
    return (Date.now() + days * 24 * 60 * 60 * 1000) / 1000;
};

describe('FeeCalculator', () => {
    describe('calculateTransactionFees', () => {
        it('should calculate fees according to maturity', () => {
            let maturity = getMaturity(365);
            expect(FeeCalculator.calculateTransactionFees(maturity, 1)).toEqual(
                '1%'
            );
            maturity = getMaturity(0);
            expect(FeeCalculator.calculateTransactionFees(maturity, 1)).toEqual(
                '0%'
            );
            maturity = getMaturity(60);
            expect(FeeCalculator.calculateTransactionFees(maturity, 1)).toEqual(
                '0.16%'
            );
            maturity = getMaturity(90);
            expect(FeeCalculator.calculateTransactionFees(maturity, 1)).toEqual(
                '0.25%'
            );
            maturity = getMaturity(183);
            expect(FeeCalculator.calculateTransactionFees(maturity, 1)).toEqual(
                '0.5%'
            );
        });

        it('should calculate fees according to annual fee', () => {
            let maturity = getMaturity(365);
            expect(FeeCalculator.calculateTransactionFees(maturity, 2)).toEqual(
                '2%'
            );
            maturity = getMaturity(183);
            expect(FeeCalculator.calculateTransactionFees(maturity, 2)).toEqual(
                '1%'
            );
        });

        it('should not return negative fees if maturity has passed', () => {
            const maturity = getMaturity(-365);
            expect(FeeCalculator.calculateTransactionFees(maturity, 1)).toEqual(
                '0%'
            );
            expect(FeeCalculator.calculateTransactionFees(maturity, 2)).toEqual(
                '0%'
            );
        });
    });

    describe('calculateProtocolFee', () => {
        it('should calculate protocol fee rate correctly', () => {
            expect(FeeCalculator.calculateProtocolFee(100)).toBe(1);
            expect(FeeCalculator.calculateProtocolFee(50)).toBe(0.5);
            expect(FeeCalculator.calculateProtocolFee(25)).toBe(0.25);
            expect(FeeCalculator.calculateProtocolFee(0)).toBe(0);
        });
    });
});
