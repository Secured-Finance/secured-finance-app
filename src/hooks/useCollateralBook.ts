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

interface CollateralBook {
    ccyIndex: number;
    collateral: number;
    usdCollateral: number;
    vault: string;
    state: string;
    borrowed: string;
    usdBorrowed: number;
    coverage: number;
    filAddr: string;
    ethAddr: string;
}

const useCollateralBook = (account: string) => {
    const [collateralBook, setCollateralBook] = useState<Array<CollateralBook>>(
        []
    );
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
        const book: Array<any> = await getCollateralBook(
            collateralContract,
            account
        );
        let colBook = [
            {
                ccyIndex: 0,
                collateral: book[6],
                usdCollateral: book[6] * ethPrice,
                vault: collateralContract._address,
                state: book[18],
                borrowed: book[12],
                usdBorrowed: book[12] * filPrice,
                coverage: book[16],
                filAddr: book[2],
                ethAddr: book[1],
            },
        ] as Array<CollateralBook>;
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
            setCollateralBook([]);
        }
    }, [account]);

    return collateralBook;
};

export default useCollateralBook;
