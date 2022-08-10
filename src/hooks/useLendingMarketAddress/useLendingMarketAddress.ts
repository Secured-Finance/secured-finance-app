import { useEffect, useMemo, useState } from 'react';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, getTermBy, toCurrency } from 'src/utils';

export const useLendingMarketAddress = (ccy: CurrencySymbol, term: string) => {
    const [lendingMarket, setLendingMarket] = useState<string>('');
    const securedFinance = useSF();
    const termValue = useMemo(() => getTermBy('value', term).termIndex, [term]);
    useEffect(() => {
        const fetchContractAddress = async () => {
            if (!securedFinance?.getLendingMarket || !termValue) return;
            setLendingMarket(
                (
                    await securedFinance.getLendingMarket(
                        toCurrency(ccy),
                        termValue
                    )
                ).contract.address
            );
        };
        fetchContractAddress();
    }, [ccy, securedFinance, term, termValue]);

    return lendingMarket;
};
