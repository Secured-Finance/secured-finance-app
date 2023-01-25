import { BigNumber } from 'ethers';
import { calculatePercentage, computeAvailableToBorrow } from './collateral';

const ONE_ETH = BigNumber.from('1000000000000000000');
const TWO_ETH = BigNumber.from('2000000000000000000');

describe('collateral.computeAvailableToBorrow', () => {
    it('should compute the available amount to borrow with a collateral of 150%', () => {
        expect(computeAvailableToBorrow(10, 1200)).toEqual(80);
        expect(computeAvailableToBorrow(100, 1200)).toEqual(8);
    });

    it('should return 0 if the asset price is 0', () => {
        expect(computeAvailableToBorrow(0, 1200)).toEqual(0);
    });
});

describe('collateral.calculatePercentage', () => {
    it('should compute the percentage', () => {
        expect(calculatePercentage(ONE_ETH, TWO_ETH)).toEqual(
            BigNumber.from(50)
        );
    });
});
