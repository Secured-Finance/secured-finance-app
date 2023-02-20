import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { CurrencySymbol } from 'src/utils';
import useSF from '../useSecuredFinance';

type ValueLockedBook = Record<CurrencySymbol, BigNumber>;
type ProtocolInformation = {
    totalNumberOfAsset: number;
    valueLockedByCurrency: ValueLockedBook | null;
};

export const useProtocolInformation = (): ProtocolInformation => {
    const securedFinance = useSF();
    const [totalNumberOfAsset, setTotalNumberOfAsset] = useState<number>(0);
    const [valueLockedByCurrency, setValueLockedByCurrency] =
        useState<ValueLockedBook | null>(null);

    useEffect(() => {
        if (!securedFinance) return;
        securedFinance.getCurrencies().then(currencies => {
            setTotalNumberOfAsset(currencies.length);
        });
        securedFinance.getProtocolDepositAmount().then(value => {
            const book = value as ValueLockedBook;
            setValueLockedByCurrency(book as ValueLockedBook);
        });
    }, [securedFinance]);

    return {
        totalNumberOfAsset,
        valueLockedByCurrency,
    };
};
