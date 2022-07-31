import { useEffect, useState } from 'react';
import useSF from 'src/hooks/useSecuredFinance';

export const useLendingMarketAddress = (ccy: string, term: string) => {
    const [lendingMarket, setLendingMarket] = useState<string>('');
    const securedFinance = useSF();
    useEffect(() => {
        const fetchContractAddress = async () => {
            if (!securedFinance) return;
            setLendingMarket(
                (await securedFinance.lendingMarkets.get(ccy, term)).contract
                    .address
            );
        };
        fetchContractAddress();
    }, [ccy, securedFinance, term]);

    return lendingMarket;
};
