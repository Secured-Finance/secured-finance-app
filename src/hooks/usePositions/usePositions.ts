import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import {
    CurrencySymbol,
    amountFormatterFromBase,
    hexToCurrencySymbol,
    toCurrency,
} from 'src/utils';

export type Position = {
    currency: string;
    maturity: string;
    amount: bigint;
    forwardValue: bigint;
    marketPrice: bigint;
};

const emptyPVPerCurrency = {
    [CurrencySymbol.ETH]: 0,
    [CurrencySymbol.WBTC]: 0,
    [CurrencySymbol.WFIL]: 0,
    [CurrencySymbol.USDC]: 0,
    [CurrencySymbol.aUSDC]: 0,
    [CurrencySymbol.axlFIL]: 0,
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
            const totalBorrowPVPerCurrency = { ...emptyPVPerCurrency };
            const totalLendPVPerCurrency = { ...emptyPVPerCurrency };
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
                const presentValue = amountFormatterFromBase[ccy](
                    position.presentValue
                );
                if (presentValue >= 0) {
                    lendCurrencies.add(ccy);
                    totalLendPVPerCurrency[ccy] += presentValue;
                } else {
                    borrowCurrencies.add(ccy);
                    totalBorrowPVPerCurrency[ccy] += Math.abs(presentValue);
                }
            });

            return {
                positions: ret,
                lendCurrencies,
                borrowCurrencies,
                totalBorrowPVPerCurrency,
                totalLendPVPerCurrency,
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
