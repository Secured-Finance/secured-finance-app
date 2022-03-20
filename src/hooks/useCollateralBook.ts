import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from 'use-wallet';

import {
    getCollateralContract,
    getCollateralBook,
} from '../services/sdk/utils';
import useSF from './useSecuredFinance';
import useBlock from './useBlock';
import { RootState } from '../store/types';
import { BigNumber } from 'src/services/sdk';

const ZERO_BN = new BigNumber(0);

interface CollateralBook {
    ccyIndex: number;
    collateral: BigNumber;
    usdCollateral: BigNumber;
    vault: string;
    locked?: BigNumber;
    usdLocked?: BigNumber;
    borrowed?: BigNumber;
    usdBorrowed: BigNumber;
}

const emptyBook: CollateralBook = {
    ccyIndex: 0,
    collateral: ZERO_BN,
    usdCollateral: ZERO_BN,
    vault: '',
    locked: ZERO_BN,
    usdLocked: ZERO_BN,
    borrowed: ZERO_BN,
    usdBorrowed: ZERO_BN,
};

interface CollateralResponse {
    colAmtETH: string | number;
    inuseETH: string | number;
    inuseFIL: string | number;
}

const useCollateralBook = (account: string) => {
    const [collateralBook, setCollateralBook] =
        useState<CollateralBook>(emptyBook);
    const securedFinance = useSF();
    const block = useBlock();
    const ethPrice = useSelector(
        (state: RootState) => state.assetPrices.ethereum.price
    );
    const filPrice = useSelector(
        (state: RootState) => state.assetPrices.filecoin.price
    );

    const collateralContract = getCollateralContract(securedFinance);
    const dispatch = useDispatch();

    const fetchCollateralBook = useCallback(async () => {
        const ethPriceBN = new BigNumber(ethPrice);
        const filPriceBN = new BigNumber(filPrice);

        const book: CollateralResponse = await getCollateralBook(
            collateralContract,
            account
        );

        const borrowed = new BigNumber(book.inuseFIL).multipliedBy(filPriceBN);

        const colBook: CollateralBook = {
            ccyIndex: 0,
            collateral: new BigNumber(book.colAmtETH),
            usdCollateral: new BigNumber(book.colAmtETH).multipliedBy(
                ethPriceBN
            ),
            vault: collateralContract._address,
            // locked: lockedCollateral.dividedBy(ethPriceBN),
            // usdLocked: lockedCollateral,
            borrowed: borrowed,
            usdBorrowed: borrowed.dividedBy(ethPriceBN),
        };
        setCollateralBook(colBook);
    }, [dispatch, collateralContract, account]);

    useEffect(() => {
        let isMounted = true;
        if (securedFinance && collateralContract && account && account != '') {
            fetchCollateralBook();
        }
        return () => {
            isMounted = false;
        };
    }, [block, collateralContract, dispatch, securedFinance, account]);

    useEffect(() => {
        if (account === null) {
            setCollateralBook(emptyBook);
        }
    }, [account]);

    return collateralBook;
};

export default useCollateralBook;
