import { formatEther } from '@ethersproject/units';
import { BigNumber } from 'ethers';

const COLLATERAL_RATIO = 1.5;

export const computeAvailableToBorrow = (
    assetPrice: number,
    etherPrice: number,
    collateral: BigNumber
) => {
    const maxToBorrowInEth = formatEther(collateral);
    return Math.floor(
        ((+maxToBorrowInEth / COLLATERAL_RATIO) * etherPrice) / assetPrice
    );
};

export const calculatePercentage = (value: BigNumber, total: BigNumber) => {
    return value.mul(100).div(total);
};
