import {
    AccountVariable,
    GraphApolloClient,
    QueryResult,
} from '@secured-finance/sf-graph-client';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';

export const useGraphClientHook = <T, K extends keyof T>(
    account: string | null,
    graphClientHook: (
        { account }: AccountVariable,
        client?: GraphApolloClient
    ) => QueryResult<T>,
    entity: K
) => {
    const block = useSelector(
        (state: RootState) => state.blockchain.latestBlock
    );
    const { data, error, refetch } = graphClientHook({
        account: account ?? '',
    });

    if (error) {
        console.error(error);
    }

    useEffect(() => {
        refetch?.();
    }, [block, refetch]);

    return data?.[entity] ?? [];
};
