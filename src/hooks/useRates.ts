import { useCallback, useEffect, useState } from 'react';
import useBlock from './useBlock';
import useSF from './useSecuredFinance';

export const useRates = (ccy: string, type: number) => {
    const selectedCcy = 'FIL';
    const securedFinance = useSF();
    const block = useBlock();
    const [rates, setRates] = useState([]);

    const fetchYieldCurve = useCallback(
        async (isMounted: boolean) => {
            let rates: Array<any>;
            switch (type) {
                case 0:
                    rates = await securedFinance.getBorrowYieldCurve(
                        selectedCcy
                    );
                    break;
                case 1:
                    rates = await securedFinance.getLendYieldCurve(selectedCcy);
                    break;
                case 2:
                    rates = await securedFinance.getMidRateYieldCurve(
                        selectedCcy
                    );
                    break;
                default:
                    break;
            }
            await setRates(rates);
        },
        [securedFinance, ccy]
    );

    useEffect(() => {
        let isMounted = true;
        if (securedFinance) {
            fetchYieldCurve(isMounted);
        }
        return () => {
            isMounted = false;
        };
    }, [block, setRates, ccy]);

    return rates;
};
