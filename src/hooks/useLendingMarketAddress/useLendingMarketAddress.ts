import { utils } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import useSF from 'src/hooks/useSecuredFinance';
import { Currency, getTermBy } from 'src/utils';

export const useLendingMarketAddress = (ccy: Currency, term: string) => {
    const [lendingMarket, setLendingMarket] = useState<string>('');
    const securedFinance = useSF();
    const termValue = useMemo(() => getTermBy('value', term).termIndex, [term]);
    useEffect(() => {
        const fetchContractAddress = async () => {
            if (!securedFinance?.lendingMarkets?.get || !termValue) return;
            setLendingMarket(
                (
                    await securedFinance.lendingMarkets.get(
                        utils.formatBytes32String(ccy),
                        termValue
                    )
                ).contract.address
            );
        };
        fetchContractAddress();
    }, [ccy, securedFinance, term, termValue]);

    return lendingMarket;
};
