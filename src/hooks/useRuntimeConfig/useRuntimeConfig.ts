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

// 'error' when there is no url, or the latest fetch failed or returned an invalid config
export type RuntimeConfigStatus = 'loading' | 'error' | 'success';

export const useRuntimeConfig = () => {
    const url = getRuntimeConfigUrl();

    // On a failed or invalid refetch react-query keeps the last successful data,
    // so banners stay up while status reports the error.
    // Until the first success every value is empty, so nothing renders.
    const { data, status: queryStatus } = useQuery({
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

    // Without a url the query is disabled and would stay pending forever
    let status: RuntimeConfigStatus = 'success';
    if (queryStatus === 'pending') status = url ? 'loading' : 'error';
    else if (queryStatus === 'error') status = 'error';

    return useMemo(
        () => ({ ...resolveRuntimeConfig(data), status }),
        [data, status]
    );
};
