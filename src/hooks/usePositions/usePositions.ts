import { Currency } from '@secured-finance/sf-core';
import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';

export type Position = {
    currency: string;
    maturity: string;
    amount: BigNumber;
    forwardValue: BigNumber;
    midPrice: BigNumber;
};

export const usePositions = (
    account: string | undefined,
    usedCurrencies: Currency[]
) => {
    const securedFinance = useSF();

    const usedCurrencyKey = useMemo(() => {
        return usedCurrencies
            .map(ccy => ccy.symbol)
            .sort()
            .join('-');
    }, [usedCurrencies]);

    return useQuery({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: [QueryKeys.POSITIONS, account, usedCurrencyKey],
        queryFn: async () => {
            const positions = await securedFinance?.getPositions(
                account ?? '',
                usedCurrencies
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
                        midPrice: calculateMidPrice(
                            position.presentValue,
                            position.futureValue
                        ),
                    } as Position)
            ),
        enabled: !!securedFinance && !!account && !!usedCurrencyKey,
    });
};

const calculateMidPrice = (
    presentValue: BigNumber,
    futureValue: BigNumber
): BigNumber => {
    const midPrice = presentValue.mul(1000000).div(futureValue);
    return BigNumber.from(Math.round(midPrice.toNumber() / 100));
};
