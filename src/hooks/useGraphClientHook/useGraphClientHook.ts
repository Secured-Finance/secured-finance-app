import { GraphApolloClient, useQuery } from '@secured-finance/sf-graph-client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';

type QueryResult<T> = {
    data: T | undefined;
    error: unknown;
    refetch?: unknown;
    networkStatus?: unknown;
    loading: boolean;
};

type QueryResultType<T, K extends keyof T> = Omit<
    QueryResult<T>,
    'data' | 'error'
> & {
    data: T[K] | undefined;
    error: QueryResult<T>['error'] | undefined;
};

export function useGraphClientHook<T, TVariables>(
    variables: TVariables,
    queryDocument: Parameters<typeof useQuery<T>>[0],
): QueryResult<T>;

export function useGraphClientHook<T, TVariables, K extends keyof T>(
    variables: TVariables,
    queryDocument: Parameters<typeof useQuery<T>>[0],
    entity: K,
    skip?: boolean,
    realTime?: boolean,
): QueryResultType<T, K>;

export function useGraphClientHook<T, TVariables, K extends keyof T>(
    variables: TVariables,
    queryDocument: Parameters<typeof useQuery<T>>[0],
    entity?: K,
    skip = false,
    realTime = false,
    client?: GraphApolloClient,
) {
    const [result, setResult] = useState<
        Omit<QueryResult<T>, 'data' | 'error'> & {
            data: QueryResultType<T, K>['data'] | QueryResult<T>['data'];
            error: QueryResult<T>['error'] | QueryResult<T>['data'];
        }
    >({
        data: undefined,
        error: undefined,
        refetch: undefined,
        networkStatus: undefined,
        loading: true,
    });

    const block = useSelector(
        (state: RootState) => state.blockchain.latestBlock,
    );

    const { refetch, networkStatus, loading } = useQuery<T, TVariables>(
        queryDocument,
        {
            client: client,
            variables: {
                ...variables,
                awaitRefetchQueries: true,
            },
            fetchPolicy: 'network-only',
            notifyOnNetworkStatusChange: true,
            pollInterval: undefined,
            skip,
            onCompleted: data => {
                setResult({
                    data: entity ? data?.[entity] : data,
                    error: undefined,
                    refetch,
                    networkStatus,
                    loading,
                });
            },
            onError: error => {
                setResult({
                    data: undefined,
                    error,
                    refetch,
                    networkStatus,
                    loading,
                });
                console.error(error);
            },
        },
    );

    useEffect(() => {
        if (realTime) {
            refetch?.();
        }
    }, [block, refetch, realTime]);

    return result;
}
