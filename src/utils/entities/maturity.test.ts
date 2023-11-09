import { Maturity } from './maturity';

describe('Maturity class', () => {
    it('should build from a number', () => {
        const maturity = new Maturity(1669852800);
        expect(maturity.toNumber()).toBe(1669852800);
    });

    it('should build from a string', () => {
        const maturity = new Maturity('1669852800');
        expect(maturity.toNumber()).toBe(1669852800);
    });

    it('should build from a BigInt', () => {
        const maturity = new Maturity(BigInt(1669852800));
        expect(maturity.toNumber()).toBe(1669852800);
    });

    it('should serialize to a string', () => {
        const maturity = new Maturity(1669852800);
        expect(maturity.toString()).toBe('1669852800');
    });

    it('should compare equal to another Maturity', () => {
        const maturity1 = new Maturity(1669852800);
        const maturity2 = new Maturity(1669852800);
        expect(maturity1.equals(maturity2)).toBe(true);
    });

    it('should compare not equal to another Maturity', () => {
        const maturity1 = new Maturity(1669852800);
        const maturity2 = new Maturity(1669852801);
        expect(maturity1.equals(maturity2)).toBe(false);
    });

    describe('isZero', () => {
        it('should compare equal to zero', () => {
            const maturity = new Maturity(0);
            expect(maturity.isZero()).toBe(true);
        });

        it('should compare not equal to zero', () => {
            const maturity = new Maturity(1669852800);
            expect(maturity.isZero()).toBe(false);
        });
    });
});
