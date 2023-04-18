import { BigNumber } from 'ethers';
import { COLLATERAL_THRESHOLD } from './currencies';

export const MAX_COVERAGE = 10000;

export const computeAvailableToBorrow = (
    assetPrice: number,
    totalCollateralInUsd: number,
    coverageRatio: number // [0,1]
) => {
    const threshold = COLLATERAL_THRESHOLD / 100.0;
    if (assetPrice === 0 || threshold < coverageRatio) return 0;
    return ((threshold - coverageRatio) * totalCollateralInUsd) / assetPrice;
};

export const calculatePercentage = (value: BigNumber, total: BigNumber) => {
    return value.mul(100).div(total);
};

export function recomputeCollateralUtilization(
    totalCollateralInUsd: number,
    coverageRatio: number,
    newTradeUsdValue: number
) {
    return (
        Math.max(
            0,

            ((totalCollateralInUsd * coverageRatio) / 10000 +
                newTradeUsdValue) /
                totalCollateralInUsd
        ) * 100
    );
}
