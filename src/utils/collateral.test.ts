import { BigNumber } from 'ethers';
import { computeAvailableToBorrow } from './collateral';

const ONE_ETH = BigNumber.from('1000000000000000000');

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
