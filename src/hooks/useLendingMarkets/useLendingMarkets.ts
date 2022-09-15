import { useEffect, useState } from 'react';
import { CurrencySymbol, toCurrency } from 'src/utils';
import useSF from '../useSecuredFinance';

export type LendingContract = {
    ccy: CurrencySymbol;
    maturity: number;
    name: string;
};

export type ContractMap = Record<string, LendingContract>;

const EmptyContractMap: ContractMap = {
    'ETH-1000': {
        ccy: CurrencySymbol.ETH,
        maturity: 1000,
        name: 'ETH-1000',
    },
};

export const useLendingMarkets = (ccy: CurrencySymbol) => {
    const [lendingMarkets, setLendingMarkets] =
        useState<ContractMap>(EmptyContractMap);
    const securedFinance = useSF();
    useEffect(() => {
        const fetchLendingMarkets = async () => {
            if (!securedFinance) return;
            const lendingMarkets = await securedFinance.getLendingMarkets(
                toCurrency(ccy)
            );

            if (lendingMarkets.length !== 0) {
                setLendingMarkets(
                    lendingMarkets.reduce<ContractMap>(
                        (acc, { name, maturity }) => ({
                            ...acc,
                            [name]: { ccy, name, maturity },
                        }),
                        {}
                    )
                );
            }
        };

        fetchLendingMarkets();
    }, [ccy, securedFinance]);
    return lendingMarkets;
};
