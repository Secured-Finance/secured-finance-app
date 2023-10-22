import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks';
import useSF from 'src/hooks/useSecuredFinance';

export const useMarketTerminationDate = () => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.TERMINATION_DATE],
        queryFn: async () => {
            return (
                (
                    await securedFinance?.getMarketTerminationDate()
                )?.toNumber() ?? undefined
            );
        },
        placeholderData: undefined,
        enabled: !!securedFinance,
        staleTime: Infinity,
        refetchOnWindowFocus: true,
    });
};
