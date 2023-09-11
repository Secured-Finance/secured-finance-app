import { BigNumber } from 'ethers';
import { calculatePercentage, computeAvailableToBorrow } from './collateral';

const ONE_ETH = BigNumber.from('1000000000000000000');
const TWO_ETH = BigNumber.from('2000000000000000000');
const ZERO_ETH = BigNumber.from('0');

describe('collateral.computeAvailableToBorrow', () => {
    it('should compute the available amount to borrow with a collateral threshold of 80%', () => {
        expect(computeAvailableToBorrow(10, 1200, 0, 80)).toEqual(96);
        expect(computeAvailableToBorrow(100, 1200, 0, 80)).toEqual(9.6);

        expect(computeAvailableToBorrow(10, 1200, 0.4, 80)).toEqual(48);
        expect(computeAvailableToBorrow(10, 1200, 0.8, 80)).toEqual(0);
        expect(computeAvailableToBorrow(10, 1200, 1, 80)).toEqual(0);
    });

    it('should return 0 if the asset price is 0', () => {
        expect(computeAvailableToBorrow(0, 1200, 10000, 80)).toEqual(0);
    });
});

describe('collateral.calculatePercentage', () => {
    it('should compute the percentage', () => {
        expect(calculatePercentage(ONE_ETH, TWO_ETH)).toEqual(
            BigNumber.from(50)
        );
    });

    it('should return 0 when total is zero', () => {
        expect(calculatePercentage(ONE_ETH, ZERO_ETH)).toEqual(ZERO_ETH);
    });
});
