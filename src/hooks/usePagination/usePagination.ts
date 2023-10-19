import { useEffect, useRef, useState } from 'react';
import { jsonStringify } from 'src/utils/json-patch';

export const usePagination = <T>(data: T[]) => {
    const [totalData, setTotalData] = useState<T[]>([]);
    const prevDataRef = useRef<T[]>([]);

    useEffect(() => {
        const currentData = data;
        const previousData = prevDataRef.current ?? [];
        if (jsonStringify(currentData) !== jsonStringify(previousData)) {
            const updatedTotalData = [...totalData, ...currentData];
            setTotalData(updatedTotalData);
            prevDataRef.current = currentData;
        }
    }, [data, totalData]);

    return totalData;
};
