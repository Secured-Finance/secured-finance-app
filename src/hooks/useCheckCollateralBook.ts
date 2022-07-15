import { useCallback, useEffect, useState } from 'react';
import useSF from './useSecuredFinance';

const useCheckCollateralBook = (account: string | null) => {
    const [status, setStatus] = useState<boolean>(false);
    const securedFinance = useSF();

    const fetchCollateralBook = useCallback(
        async (account: string) => {
            if (!securedFinance) return;
            const status = await securedFinance.checkRegisteredUser(account);
            setStatus(status);
        },
        [securedFinance]
    );

    useEffect(() => {
        if (!account) {
            setStatus(false);
        }
        if (securedFinance && account) {
            fetchCollateralBook(account);
        }
    }, [securedFinance, account, fetchCollateralBook]);

    return status;
};

export default useCheckCollateralBook;
