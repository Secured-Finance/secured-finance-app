/* eslint-disable react-hooks/rules-of-hooks */
import { GraphApolloClient, useQuery } from '@secured-finance/sf-graph-client';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';

export const useGraphClientHook = <T, TVariables, K extends keyof T>(
    variables: TVariables,
    queryDocument: Parameters<typeof useQuery<T>>[0],
    entity: K,
    realTime = false,
    client?: GraphApolloClient
) => {
    if (!queryDocument) {
        return {
            data: undefined,
            error: undefined,
            refetch: undefined,
            networkStatus: undefined,
        };
    }
    const { error, data, refetch, networkStatus } = useQuery<T, TVariables>(
        queryDocument,
        {
            client: client,
            variables: {
                ...variables,
                awaitRefetchQueries: true,
            },
            fetchPolicy: 'network-only',
            notifyOnNetworkStatusChange: true,
        }
    );

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
