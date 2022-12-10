import { BigNumber } from 'ethers';
import { Maturity } from './maturity';

describe('Maturity class', () => {
    it('should build from a number', () => {
        const maturity = new Maturity(1669852800);
        expect(maturity.getMaturity()).toBe(1669852800);
    });

    it('should build from a string', () => {
        const maturity = new Maturity('1669852800');
        expect(maturity.getMaturity()).toBe(1669852800);
    });

    it('should build from a BigNumber', () => {
        const maturity = new Maturity(BigNumber.from(1669852800));
        expect(maturity.getMaturity()).toBe(1669852800);
    });
});
