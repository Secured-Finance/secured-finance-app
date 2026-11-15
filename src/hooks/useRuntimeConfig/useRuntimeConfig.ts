import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { QueryKeys } from 'src/hooks/queries';
import {
    fetchRuntimeConfig,
    getRuntimeConfigUrl,
    resolveRuntimeConfig,
} from 'src/utils';

const STALE_TIME_MS = 30 * 1000;
const REFETCH_INTERVAL_MS = 60 * 1000;

export const useRuntimeConfig = () => {
    const url = getRuntimeConfigUrl();

    // On a failed refetch react-query keeps the last successful data.
    // Until the first success every value is empty, so nothing renders.
    const { data } = useQuery({
        queryKey: [QueryKeys.RUNTIME_CONFIG, url],
        queryFn: () => {
            if (!url) {
                throw new Error('NEXT_PUBLIC_RUNTIME_CONFIG_URL is not set');
            }
            return fetchRuntimeConfig(url);
        },
        enabled: !!url,
        staleTime: STALE_TIME_MS,
        refetchInterval: REFETCH_INTERVAL_MS,
        retry: 1,
    });

    return useMemo(() => resolveRuntimeConfig(data), [data]);
};
