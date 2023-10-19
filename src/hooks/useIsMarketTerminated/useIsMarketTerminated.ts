import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';

export const useIsMarketTerminated = () => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.TERMINATED],
        queryFn: async () => {
            return securedFinance?.isTerminated() ?? false;
        },
        placeholderData: false,
        enabled: !!securedFinance,
        staleTime: Infinity,
        refetchOnWindowFocus: true,
    });
};
