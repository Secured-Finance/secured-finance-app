import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';

export const useTotalNumberOfAsset = () => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.CURRENCIES],
        queryFn: async () => {
            const currencies = await securedFinance?.getCurrencies();
            return currencies ?? [];
        },
        select: currencies => currencies.length,
        enabled: !!securedFinance,
    });
};
