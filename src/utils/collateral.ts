import { BigNumber } from 'ethers';

const COLLATERAL_RATIO = 1.5;

export const computeAvailableToBorrow = (
    assetPrice: number,
    totalCollateralInUsd: number
) => {
    if (assetPrice === 0) return 0;
    return totalCollateralInUsd / COLLATERAL_RATIO / assetPrice;
};

export const calculatePercentage = (value: BigNumber, total: BigNumber) => {
    return value.mul(100).div(total);
};
