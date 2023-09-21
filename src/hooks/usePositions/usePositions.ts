import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, toCurrency } from 'src/utils';

export type Position = {
    currency: string;
    maturity: string;
    amount: BigNumber;
    forwardValue: BigNumber;
    marketPrice: BigNumber;
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
        select: positions =>
            positions.map(
                position =>
                    ({
                        currency: position.ccy,
                        maturity: position.maturity.toString(),
                        amount: position.presentValue,
                        forwardValue: position.futureValue,
                        marketPrice: calculateMarketPrice(
                            position.presentValue,
                            position.futureValue
                        ),
                    } as Position)
            ),
        enabled: !!securedFinance && !!account && !!usedCurrencyKey,
    });
};

const calculateMarketPrice = (
    presentValue: BigNumber,
    futureValue: BigNumber
): BigNumber => {
    const marketPrice = presentValue.mul(1000000).div(futureValue);
    return BigNumber.from(Math.round(marketPrice.toNumber() / 100));
};
