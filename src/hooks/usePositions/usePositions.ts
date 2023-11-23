import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, hexToCurrencySymbol, toCurrency } from 'src/utils';

export type Position = {
    currency: string;
    maturity: string;
    amount: bigint;
    forwardValue: bigint;
    marketPrice: bigint;
};

export const usePositions = (
    account: string | undefined,
    usedCurrencies: CurrencySymbol[]
) => {
    const securedFinance = useSF();

    const usedCurrencyKey = useMemo(() => {
        return usedCurrencies.sort().join('-');
    }, [usedCurrencies]);

    return useQuery({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: [QueryKeys.POSITIONS, account, usedCurrencyKey],
        queryFn: async () => {
            const positions = await securedFinance?.getPositions(
                account ?? '',
                usedCurrencies.map(c => toCurrency(c))
            );
            return positions ?? [];
        },
        select: positions => {
            const lendCurrencies: Set<CurrencySymbol> = new Set();
            const borrowCurrencies: Set<CurrencySymbol> = new Set();
            const ret: Position[] = [];

            positions.forEach(position => {
                ret.push({
                    currency: position.ccy,
                    maturity: position.maturity.toString(),
                    amount: position.presentValue,
                    forwardValue: position.futureValue,
                    marketPrice: calculateMarketPrice(
                        position.presentValue,
                        position.futureValue
                    ),
                } as Position);
                const ccy = hexToCurrencySymbol(position.ccy);
                if (!ccy) return;
                if (position.presentValue >= 0) {
                    lendCurrencies.add(ccy);
                }
                if (position.presentValue < 0) {
                    borrowCurrencies.add(ccy);
                }
            });

            return {
                positions: ret,
                lendCurrencies,
                borrowCurrencies,
            };
        },
        enabled: !!securedFinance && !!account && !!usedCurrencyKey,
    });
};

const calculateMarketPrice = (
    presentValue: bigint,
    futureValue: bigint
): bigint => {
    const marketPrice = (presentValue * BigInt(1000000)) / futureValue;
    return BigInt(Math.round(Number(marketPrice) / 100));
};
