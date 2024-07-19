import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, toCurrency } from 'src/utils';
import { Maturity } from 'src/utils/entities';

export const useZCToken = (ccy: CurrencySymbol, maturity: Maturity) => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.ZC_TOKEN, ccy, maturity],
        queryFn: async () =>
            securedFinance?.getZCToken(toCurrency(ccy), maturity.toNumber()),
        enabled: !!securedFinance,
    });
};
