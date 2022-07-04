import { BigNumber } from 'ethers';
import { collateralUsage, computeAvailableToBorrow } from './collateral';
describe('collateral.collateralUsage', () => {
    it('should compute the collateral usage', () => {
        const lockedCollateral = BigNumber.from(500);
        const collateral = BigNumber.from(1000);
        expect(collateralUsage(lockedCollateral, collateral)).toEqual(50);
    });

    it('should return 0 if collateral is 0', () => {
        const lockedCollateral = BigNumber.from(500);
        const collateral = BigNumber.from(0);
        expect(collateralUsage(lockedCollateral, collateral)).toEqual(0);
    });

    it('should return 0 if locked collateral is 0', () => {
        const lockedCollateral = BigNumber.from(0);
        const collateral = BigNumber.from(1000);
        expect(collateralUsage(lockedCollateral, collateral)).toEqual(0);
    });

    it('should return 0 if the locked collateral is undefined', () => {
        const collateral = BigNumber.from(1000);
        expect(collateralUsage(undefined, collateral)).toEqual(0);
    });

    it('should return 100 if the locked collateral is bigger than the collateral', () => {
        const lockedCollateral = BigNumber.from(1000);
        const collateral = BigNumber.from(500);
        expect(collateralUsage(lockedCollateral, collateral)).toEqual(100);
    });
});

describe('collateral.computeAvailableToBorrow', () => {
    it('should compute the available to borrow', () => {
        const collateral = BigNumber.from(1);
        expect(computeAvailableToBorrow(10, 1200, collateral)).toEqual(180);
    });

    it('should round the result', () => {
        const collateral = BigNumber.from(1);
        expect(computeAvailableToBorrow(10, 1200.12, collateral)).toEqual(180);
    });
});
