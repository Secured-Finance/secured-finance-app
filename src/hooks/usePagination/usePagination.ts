import { useQuery } from '@secured-finance/sf-graph-client';
import { useEffect, useRef, useState } from 'react';
import { useGraphClientHook } from '../useGraphClientHook';

export const usePagination = (
    account: string,
    skip: number,
    query: Parameters<typeof useQuery>[0],
    fetchData: boolean
) => {
    const [totalData, setTotalData] = useState([]);

    const data = useGraphClientHook(
        { address: account?.toLowerCase(), skip: skip, first: 100 },
        query,
        'user' as never,
        fetchData
    );

    const totalDataCount = data?.data?.[Object.keys(data?.data)[0]];

    const prevDataRef = useRef(data?.data?.[Object.keys(data?.data)[1]]);

    useEffect(() => {
        const newData = data.data?.[Object.keys(data.data)[1]] ?? [];
        const previousData = prevDataRef.current ?? [];
        const currentData = newData;
        if (JSON.stringify(currentData) !== JSON.stringify(previousData)) {
            const updatedTotalData = [...totalData, ...currentData];
            setTotalData(updatedTotalData);
            prevDataRef.current = currentData as never;
        }
    }, [skip, data.data, totalData]);

    return { totalData, totalDataCount };
};
