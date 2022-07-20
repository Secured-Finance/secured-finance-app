import { useCallback, useEffect, useState } from 'react';
import useSF from 'src/hooks/useSecuredFinance';

export const useCheckCollateralBook = (account: string | null) => {
    const [status, setStatus] = useState(false);
    const securedFinance = useSF();

    const fetchCollateralBook = useCallback(
        async (account: string) => {
            if (!securedFinance) return false;
            return await securedFinance.checkRegisteredUser(account);
        },
        [securedFinance]
    );

    useEffect(() => {
        if (!account || !securedFinance) {
            setStatus(false);
        } else {
            setStatus(true);
            fetchCollateralBook(account).then(status => setStatus(status));
        }
    }, [securedFinance, account, fetchCollateralBook]);

    return status;
};
