import { BigNumber } from 'ethers';
import { collateralUsage, computeAvailableToBorrow } from './collateral';

const ONE_ETH = BigNumber.from('1000000000000000000');
const HALF_ETH = BigNumber.from('500000000000000000');
const ZERO_BN = BigNumber.from('0');

describe('collateral.collateralUsage', () => {
    it('should compute the collateral usage', () => {
        expect(collateralUsage(HALF_ETH, ONE_ETH)).toEqual(33);
        expect(collateralUsage(HALF_ETH, ZERO_BN)).toEqual(100);
        expect(collateralUsage(ZERO_BN, ONE_ETH)).toEqual(0);
        expect(collateralUsage(ONE_ETH, ONE_ETH)).toEqual(50);
    });

    it('should return 0 if locked collateral is 0 whatever is the total collateral', () => {
        expect(collateralUsage(ZERO_BN, ONE_ETH)).toEqual(0);
        expect(collateralUsage(ZERO_BN, HALF_ETH)).toEqual(0);
    });

    it('should return o if total collateral is 0', () => {
        expect(collateralUsage(ZERO_BN, ZERO_BN)).toEqual(0);
    });

    it('should return 0 if the locked collateral is undefined', () => {
        expect(collateralUsage(undefined, ONE_ETH)).toEqual(0);
    });
});

describe('collateral.computeAvailableToBorrow', () => {
    it('should compute the available amount to borrow with a collateral of 150%', () => {
        expect(computeAvailableToBorrow(10, 1200, ONE_ETH)).toEqual(80);
    });

    it('should round the result', () => {
        expect(computeAvailableToBorrow(10, 1200.12, ONE_ETH)).toEqual(80);
    });

    it('should return show the formula when assetPrice and EthPrice are the same', () => {
        expect(computeAvailableToBorrow(1200, 1200, ONE_ETH.mul(10))).toEqual(
            6
        );
    });
});
