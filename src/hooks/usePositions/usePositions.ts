import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { calculate } from 'src/utils';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';
import {
    AmountConverter,
    CurrencySymbol,
    hexToCurrencySymbol,
    toCurrency,
} from 'src/utils';

export type Position = {
    currency: string;
    maturity: string;
    amount: bigint;
    futureValue: bigint;
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
            const totalBorrowPVPerCurrency: Partial<
                Record<CurrencySymbol, number>
            > = {};
            const totalLendPVPerCurrency: Partial<
                Record<CurrencySymbol, number>
            > = {};
            const lendCurrencies: Set<CurrencySymbol> = new Set();
            const borrowCurrencies: Set<CurrencySymbol> = new Set();
            const ret: Position[] = [];

            positions.forEach(position => {
                ret.push({
                    currency: position.ccy,
                    maturity: position.maturity.toString(),
                    amount: position.presentValue,
                    futureValue: position.futureValue,
                    marketPrice: calculateMarketPrice(
                        position.presentValue,
                        position.futureValue
                    ),
                } as Position);
                const ccy = hexToCurrencySymbol(position.ccy);
                if (!ccy) return;
                const presentValue = AmountConverter.fromBase(
                    position.presentValue,
                    ccy
                );
                if (presentValue >= 0) {
                    lendCurrencies.add(ccy);
                    totalLendPVPerCurrency[ccy] =
                        (totalLendPVPerCurrency[ccy] ?? 0) + presentValue;
                } else {
                    borrowCurrencies.add(ccy);
                    totalBorrowPVPerCurrency[ccy] =
                        (totalBorrowPVPerCurrency[ccy] ?? 0) +
                        calculate.abs(presentValue);
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
    return BigInt(
        calculate.round(
            Number(marketPrice) / FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR
        )
    );
};
