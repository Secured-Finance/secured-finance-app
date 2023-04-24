import { BigNumber } from 'ethers';
import {
    calculatePercentage,
    computeAvailableToBorrow,
    recomputeCollateralUtilization,
} from './collateral';

const ONE_ETH = BigNumber.from('1000000000000000000');
const TWO_ETH = BigNumber.from('2000000000000000000');

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
});

describe('recomputeCollateralUtilization', () => {
    it('should increase the collateral utilization when the new usdTradeValue is positive', () => {
        expect(recomputeCollateralUtilization(1000, 5000, 100)).toEqual(6000);
        expect(recomputeCollateralUtilization(1000, 5000, 200)).toEqual(7000);
    });

    it('should decrease the collateral utilization when the new usdTradeValue is negative', () => {
        expect(recomputeCollateralUtilization(1000, 5000, -100)).toEqual(4000);
        expect(recomputeCollateralUtilization(1000, 5000, -200)).toEqual(3000);
    });

    it('should not change the collateral utilization when the new usdTradeValue is 0', () => {
        expect(recomputeCollateralUtilization(1000, 5000, 0)).toEqual(5000);
    });

    it('should return 0 if the new usdTradeValue is bigger than the collateral and negative', () => {
        expect(recomputeCollateralUtilization(1000, 5000, -2000)).toEqual(0);
    });
});
