import { QueryResult, useQuery } from '@secured-finance/sf-graph-client';
import { useEffect, useRef, useState } from 'react';
import { useGraphClientHook } from '../useGraphClientHook';

type QueryResultType<T> = Omit<QueryResult<T>, 'data' | 'error'> & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    totalData: any;
    totalDataCount: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const usePagination = <T extends Record<string, any>, K extends keyof T>(
    account: string,
    skip: number,
    query: Parameters<typeof useQuery<T>>[0],
    fetchData: boolean
): QueryResultType<T> => {
    const [totalData, setTotalData] = useState<T[K][]>([]);

    const variables = {
        address: account?.toLowerCase(),
        skip: skip,
        first: 100,
    };

    const data = useGraphClientHook<T, typeof variables, K>(
        variables,
        query,
        'user' as K,
        fetchData
    );

    const totalDataCount = data?.data?.[Object.keys(data?.data as T)[0]];

    const prevDataRef = useRef<T[K] | undefined>(
        data?.data?.[Object.keys(data?.data as T)[1]]
    );

    useEffect(() => {
        const newData = data?.data?.[Object.keys(data?.data as T)[1]] ?? [];
        const previousData = prevDataRef.current ?? [];
        const currentData = newData;
        if (JSON.stringify(currentData) !== JSON.stringify(previousData)) {
            const updatedTotalData = [...totalData, ...currentData];
            setTotalData(updatedTotalData);
            prevDataRef.current = currentData;
        }
    }, [skip, data?.data, totalData]);

    return { totalData, totalDataCount };
};
