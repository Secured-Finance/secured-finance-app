import { useCollateralBookFromVault } from '@secured-finance/sf-graph-client';
import { BigNumber } from 'bignumber.js';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/types';

const ZERO_BN = new BigNumber('0');

interface CollateralBook {
    ccyIndex: number;
    ccyName: string;
    collateral: BigNumber;
    usdCollateral: BigNumber;
    vault: string;
    locked?: BigNumber;
    usdLocked?: BigNumber;
    borrowed?: BigNumber;
    usdBorrowed?: BigNumber;
}

const emptyBook: CollateralBook = {
    ccyIndex: 0,
    ccyName: 'ETH',
    collateral: ZERO_BN,
    usdCollateral: ZERO_BN,
    vault: '',
    locked: ZERO_BN,
    usdLocked: ZERO_BN,
    borrowed: ZERO_BN,
    usdBorrowed: ZERO_BN,
};

const useCollateralBook = (account: string, vault: string) => {
    const [collateralBook, setCollateralBook] =
        useState<CollateralBook>(emptyBook);
    const ethPrice = useSelector(
        (state: RootState) => state.assetPrices.ethereum.price
    );
    const ethPriceBN = new BigNumber(ethPrice);
    const book = useCollateralBookFromVault(vault, account) as any;
    useMemo(() => {
        if (book) {
            const colBook: CollateralBook = {
                ccyIndex: 0,
                ccyName: book.currency.shortName,
                collateral: new BigNumber(book.independentCollateral),
                usdCollateral: new BigNumber(
                    book.independentCollateral
                ).multipliedBy(ethPriceBN),
                vault: book.vault.address,
                locked: new BigNumber(book.lockedCollateral),
                usdLocked: new BigNumber(book.lockedCollateral).multipliedBy(
                    ethPriceBN
                ),
            };
            setCollateralBook(colBook);
        }
    }, [book]);

    return collateralBook;
};

export default useCollateralBook;
