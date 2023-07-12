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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const arraysAreEqual = (arr1: string | any[], arr2: string | any[]) => {
        if (arr1.length !== arr2.length) {
            return false;
        }

        for (let i = 0; i < arr1.length; i++) {
            const obj1 = arr1[i];
            const obj2 = arr2[i];

            for (const key in obj1) {
                if (obj1[key] !== obj2[key]) {
                    return false;
                }
            }
        }

        return true;
    };

    useEffect(() => {
        const newData = data.data?.[Object.keys(data.data)[1]] ?? [];
        const previousData = prevDataRef.current ?? [];
        const currentData = newData;
        if (!arraysAreEqual(previousData, currentData)) {
            const updatedTotalData = [...totalData, ...currentData];
            setTotalData(updatedTotalData);
            prevDataRef.current = currentData as never;
        }
    }, [skip, data.data, totalData]);

    return { totalData, totalDataCount };
};
