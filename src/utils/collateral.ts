import { BigNumber } from 'ethers';

export const MAX_COVERAGE = 10000;
export const ZERO_BN = BigNumber.from(0);

export const computeAvailableToBorrow = (
    assetPrice: number,
    totalCollateralInUsd: number,
    coverageRatio: number, // [0,1]
    collateralThreshold: number
) => {
    const threshold = collateralThreshold / 100.0;
    if (assetPrice === 0 || threshold < coverageRatio) return 0;
    return ((threshold - coverageRatio) * totalCollateralInUsd) / assetPrice;
};

export const calculatePercentage = (value: BigNumber, total: BigNumber) => {
    return total.isZero() ? ZERO_BN : value.mul(100).div(total);
};
