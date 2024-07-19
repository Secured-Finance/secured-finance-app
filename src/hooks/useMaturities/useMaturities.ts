import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, toCurrency } from 'src/utils';

export const useMaturities = (ccy: CurrencySymbol, pastMaturityCount = 0) => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.MATURITIES, ccy, pastMaturityCount],
        queryFn: async () => {
            const currency = toCurrency(ccy);
            const [maturities = [], latestAutoRollLog] = await Promise.all([
                securedFinance?.getMaturities(currency),
                securedFinance?.getLatestAutoRollLog(currency),
            ]);
            const pastMaturities: bigint[] = [];

            if (pastMaturityCount > 0 && latestAutoRollLog?.prev) {
                pastMaturities.push(latestAutoRollLog.prev);

                for (let i = 0; i < pastMaturityCount - 1; i++) {
                    const autoRollLog = await securedFinance?.getAutoRollLog(
                        currency,
                        Number(pastMaturities[0])
                    );

                    if (autoRollLog && autoRollLog.prev) {
                        pastMaturities.unshift(autoRollLog.prev);
                    }
                }
            }

            return [...pastMaturities, ...maturities];
        },
        select: maturities => maturities?.map(Number),
        initialData: [],
        enabled: !!securedFinance && !!ccy,
    });
};
