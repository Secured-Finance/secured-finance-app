import { BigNumber } from 'ethers';

const COLLATERAL_RATIO = 1.5;
const MAX_COVERAGE = 10000;

export const computeAvailableToBorrow = (
    assetPrice: number,
    totalCollateralInUsd: number,
    coverageRatio: number // 0: 0%, 10000: 100%
) => {
    if (assetPrice === 0) return 0;
    return (
        (((MAX_COVERAGE - coverageRatio) / MAX_COVERAGE) *
            totalCollateralInUsd) /
        COLLATERAL_RATIO /
        assetPrice
    );
};

export const calculatePercentage = (value: BigNumber, total: BigNumber) => {
    return value.mul(100).div(total);
};
