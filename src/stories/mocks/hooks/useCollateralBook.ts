import { BigNumber } from 'bignumber.js';

export const useCollateralBook = () => {
    return {
        ccyIndex: 0,
        ccyName: 'FIL',
        collateral: new BigNumber(1),
        usdCollateral: new BigNumber(1000),
        vault: '',
        locked: new BigNumber(0.5),
    };
};
