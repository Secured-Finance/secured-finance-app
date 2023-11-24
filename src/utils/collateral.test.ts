import { calculatePercentage } from './collateral';

const ONE_ETH = BigInt('1000000000000000000');
const TWO_ETH = BigInt('2000000000000000000');
const ZERO_ETH = BigInt('0');

describe('collateral.calculatePercentage', () => {
    it('should compute the percentage', () => {
        expect(calculatePercentage(ONE_ETH, TWO_ETH)).toEqual(BigInt(50));
    });

    it('should return 0 when total is zero', () => {
        expect(calculatePercentage(ONE_ETH, ZERO_ETH)).toEqual(ZERO_ETH);
    });
});
