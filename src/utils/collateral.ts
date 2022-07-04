import { BigNumber } from 'ethers';

export const computeAvailableToBorrow = (
    assetPrice: number,
    etherPrice: number,
    collateral: BigNumber
) => {
    return Math.floor(
        ((collateral.toNumber() * etherPrice) / assetPrice) * 1.5
    );
};

export const collateralUsage = (
    lockedCollateral: BigNumber,
    collateral: BigNumber
) => {
    if (collateral.isZero() || !lockedCollateral) {
        return 0;
    }

    if (lockedCollateral.gt(collateral)) {
        return 100;
    }

    return lockedCollateral.mul(100).div(collateral).toNumber();
};
