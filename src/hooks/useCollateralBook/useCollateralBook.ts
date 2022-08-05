import { BigNumber } from 'bignumber.js';
import { utils } from 'ethers';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useSF from 'src/hooks/useSecuredFinance';
import { Currency, currencyMap } from 'src/utils';
import { RootState } from '../../store/types';

const ZERO_BN = new BigNumber('0');

export interface CollateralBook {
    ccyIndex: number;
    ccyName: string;
    collateral: BigNumber;
    usdCollateral: BigNumber;
    locked: BigNumber;
    usdLocked: BigNumber;
}

const emptyBook: CollateralBook = {
    ccyIndex: 0,
    ccyName: 'ETH',
    collateral: ZERO_BN,
    usdCollateral: ZERO_BN,
    locked: ZERO_BN,
    usdLocked: ZERO_BN,
};

export const useCollateralBook = (
    account: string | null,
    ccy = Currency.ETH
) => {
    const [collateralBook, setCollateralBook] = useState(emptyBook);
    const securedFinance = useSF();
    const ethPrice = useSelector(
        (state: RootState) => state.assetPrices.ethereum.price
    );

    useEffect(() => {
        if (!securedFinance || !account) {
            return;
        }
        const getCollateralBook = async () => {
            const { independentCollateral, lockedCollateral } =
                await securedFinance.getCollateralBook(
                    account,
                    utils.formatBytes32String(ccy)
                );

            setCollateralBook({
                ccyIndex: currencyMap[ccy].indexCcy,
                ccyName: ccy,
                collateral: new BigNumber(independentCollateral.toString()),
                usdCollateral: new BigNumber(
                    independentCollateral.toString()
                ).multipliedBy(ethPrice),
                locked: new BigNumber(lockedCollateral.toString()),
                usdLocked: new BigNumber(
                    lockedCollateral.toString()
                ).multipliedBy(ethPrice),
            });
        };
        getCollateralBook();
    }, [account, ccy, securedFinance, ethPrice]);
    // console.log(collateralBook);
    return collateralBook;
};
