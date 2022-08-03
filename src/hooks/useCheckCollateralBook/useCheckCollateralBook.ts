import { useEffect, useState } from 'react';
import useSF from 'src/hooks/useSecuredFinance';

export const useCheckCollateralBook = (account: string | null) => {
    const [status, setStatus] = useState(false);
    const securedFinance = useSF();

    useEffect(() => {
        const checkCollateralBook = async () => {
            if (!securedFinance || !account) return;
            setStatus(await securedFinance.checkRegisteredUser(account));
        };
        checkCollateralBook();
    }, [securedFinance, account]);

    return status;
};
