import { useCallback, useEffect, useState } from 'react';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, divide, toCurrency } from 'src/utils';

export const useOrderFee = (ccy: CurrencySymbol) => {
    const securedFinance = useSF();
    const [orderFee, setOrderFee] = useState(0);

    const getOrderFee = useCallback(async () => {
        if (!securedFinance || !ccy) {
            return;
        }

        const fee = await securedFinance.getOrderFeeRate(toCurrency(ccy));
        setOrderFee(divide(fee.toNumber(), 100)); // 100 -> 1%
    }, [securedFinance, ccy]);

    useEffect(() => {
        getOrderFee();
        return () => {
            setOrderFee(0);
        };
    }, [getOrderFee]);

    return orderFee;
};
