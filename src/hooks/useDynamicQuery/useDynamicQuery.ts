import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getGraphQLConfig } from 'src/utils/graphql';

// Generic fetcher for dynamic GraphQL queries
async function dynamicGraphqlFetcher<TData>(
    endpoint: string,
    headers: Record<string, string>,
    queryDocument: { loc?: { source?: { body?: string } } }
): Promise<TData> {
    const query = queryDocument.loc?.source?.body;
    if (!query) {
        throw new Error('Invalid query document');
    }

    const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query }),
    });

    const json = await response.json();

    if (json.errors) {
        const { message } = json.errors[0];
        throw new Error(message);
    }

    return json.data;
}

interface UseDynamicQueryOptions<TData, TError>
    extends Omit<UseQueryOptions<TData, TError>, 'queryFn' | 'queryKey'> {
    queryDocument: { loc?: { source?: { body?: string } } };
    queryKey: (string | number | boolean | Record<string, unknown>)[];
}

/**
 * Hook for using dynamic GraphQL queries (like those from sf-graph-client)
 * with React Query and the proper GraphQL configuration
 */
export function useDynamicQuery<TData = unknown, TError = Error>({
    queryDocument,
    queryKey,
    ...options
}: UseDynamicQueryOptions<TData, TError>) {
    const config = getGraphQLConfig();

    return useQuery<TData, TError>({
        queryKey: [
            'dynamic-graphql',
            config.endpoint,
            config.fetchParams?.headers,
            queryDocument,
            ...queryKey,
        ],
        queryFn: () =>
            dynamicGraphqlFetcher<TData>(
                config.endpoint,
                config.fetchParams?.headers || {},
                queryDocument
            ),
        enabled: !!queryDocument.loc?.source?.body && (options.enabled ?? true),
        ...options,
    });
}
