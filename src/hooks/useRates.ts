import { useCallback, useEffect, useState } from 'react';
import useBlock from './useBlock';
import useSF from './useSecuredFinance';

export const useRates = (ccy: string, type: number) => {
    const selectedCcy = 'FIL';
    const securedFinance = useSF();
    const block = useBlock();
    const [rates, setRates] = useState([]);

    const fetchYieldCurve = useCallback(async () => {
        let rates;
        switch (type) {
            case 0:
                rates = await securedFinance.getBorrowYieldCurve(selectedCcy);
                break;
            case 1:
                rates = await securedFinance.getLendYieldCurve(selectedCcy);
                break;
            case 2:
                rates = await securedFinance.getMidRateYieldCurve(selectedCcy);
                break;
            default:
                break;
        }
        setRates(rates);
    }, [type, securedFinance]);

    useEffect(() => {
        if (securedFinance) {
            fetchYieldCurve();
        }
    }, [block, setRates, ccy, securedFinance, fetchYieldCurve]);

    return rates;
};
