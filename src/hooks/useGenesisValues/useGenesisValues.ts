import { useQueries } from '@tanstack/react-query';
import useSF from 'src/hooks/useSecuredFinance';
import { hexToCurrencySymbol, toCurrency } from 'src/utils';
import { QueryKeys } from '../queries';
import { Position } from '../usePositions';

export const useGenesisValues = (
    account: string | undefined,
    positions: Position[]
) => {
    const securedFinance = useSF();

    return useQueries({
        queries: positions.map(position => {
            const currency = hexToCurrencySymbol(position.currency);
            return {
                queryKey: [
                    QueryKeys.GENESIS_VALUE,
                    position.currency,
                    position.amount,
                    account,
                ],
                queryFn: async () => {
                    const genesisValue = currency
                        ? await securedFinance?.getGenesisValue(
                              toCurrency(currency),
                              account || ''
                          )
                        : undefined;

                    return {
                        currency,
                        amount: genesisValue?.[0],
                        amountInPV: genesisValue?.[1],
                        amountInFV: genesisValue?.[2],
                    };
                },
                enabled: !!securedFinance && !!account && !!currency,
            };
        }),
    });
};
