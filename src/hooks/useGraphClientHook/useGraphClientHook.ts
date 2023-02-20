import { GraphApolloClient, useQuery } from '@secured-finance/sf-graph-client';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';

export const useGraphClientHook = <T, K extends keyof T>(
    variables: { [key: string]: unknown },
    queryDocument: Parameters<typeof useQuery<T>>[0],
    entity: K,
    realTime = false,
    client?: GraphApolloClient
) => {
    const { error, data, refetch, networkStatus } = useQuery<T>(queryDocument, {
        client: client,
        variables: {
            ...variables,
            awaitRefetchQueries: true,
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
    });

    const block = useSelector(
        (state: RootState) => state.blockchain.latestBlock
    );

    if (error) {
        console.error(error);
    }

    useEffect(() => {
        if (realTime) refetch?.();
    }, [block, realTime, refetch]);

    const isExists = data?.[entity];

    return {
        data: isExists ? data[entity] : undefined,
        error,
        refetch,
        networkStatus,
    };
};
