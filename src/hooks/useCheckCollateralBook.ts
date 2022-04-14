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
    }, [dispatch, securedFinance, account]);

    useEffect(() => {
        let isMounted = true;
        if (account === null) {
            setStatus(false);
        }
        if (securedFinance && account !== '') {
            fetchCollateralBook();
        }
        return () => {
            isMounted = false;
        };
    }, [dispatch, securedFinance, account]);

    return status;
};

export default useCheckCollateralBook;
