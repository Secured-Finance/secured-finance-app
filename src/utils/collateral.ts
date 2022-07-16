import { BigNumber, utils } from 'ethers';
const COLLATERAL_RATIO = 1.5;

export const computeAvailableToBorrow = (
    assetPrice: number,
    etherPrice: number,
    collateral: BigNumber
) => {
    const maxToBorrowInEth = utils.formatEther(collateral);
    return Math.floor(
        ((+maxToBorrowInEth / COLLATERAL_RATIO) * etherPrice) / assetPrice
    );
};

export const collateralUsage = (
    lockedCollateral: BigNumber | undefined,
    independentCollateral: BigNumber
) => {
    if (!lockedCollateral) {
        return 0;
    }
    const totalCollateral = independentCollateral.add(lockedCollateral);

    if (totalCollateral.isZero()) {
        return 0;
    }

    if (lockedCollateral.gt(totalCollateral)) {
        return 100;
    }

    return lockedCollateral.mul(100).div(totalCollateral).toNumber();
};
