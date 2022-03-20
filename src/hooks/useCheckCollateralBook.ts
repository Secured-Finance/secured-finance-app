import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
    getCollateralContract,
    checkCollateralBook,
} from '../services/sdk/utils';
import useSF from './useSecuredFinance';
import useBlock from './useBlock';

const useCheckCollateralBook = (account: string) => {
    const [status, setStatus] = useState<boolean>(false);
    const securedFinance = useSF();
    const block = useBlock();

    const collateralContract = getCollateralContract(securedFinance);
    const dispatch = useDispatch();

    const fetchCollateralBook = useCallback(async () => {
        const status: boolean = await checkCollateralBook(
            collateralContract,
            account
        );
        setStatus(status);
    }, [dispatch, collateralContract, account]);

    useEffect(() => {
        let isMounted = true;
        if (account === null) {
            setStatus(false);
        }
        if (securedFinance && collateralContract && account != '') {
            fetchCollateralBook();
        }
        return () => {
            isMounted = false;
        };
    }, [block, collateralContract, dispatch, securedFinance, account]);

    return status;
};

export default useCheckCollateralBook;
