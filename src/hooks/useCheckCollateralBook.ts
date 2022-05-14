import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import useSF from './useSecuredFinance';

const useCheckCollateralBook = (account: string) => {
    const [status, setStatus] = useState<boolean>(false);
    const securedFinance = useSF();
    const dispatch = useDispatch();

    const fetchCollateralBook = useCallback(async () => {
        const status = await securedFinance.checkRegisteredUser(account);
        setStatus(status);
    }, [securedFinance, account]);

    useEffect(() => {
        if (account === null) {
            setStatus(false);
        }
        if (securedFinance && account !== '') {
            fetchCollateralBook();
        }
    }, [dispatch, securedFinance, account, fetchCollateralBook]);

    return status;
};

export default useCheckCollateralBook;
