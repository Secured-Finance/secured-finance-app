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
