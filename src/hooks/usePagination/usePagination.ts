import { useEffect, useRef, useState } from 'react';

export const usePagination = <T>(data: T[]) => {
    const [totalData, setTotalData] = useState<T[]>([]);
    const prevDataRef = useRef<T[]>([]);

    useEffect(() => {
        const currentData = data;
        const previousData = prevDataRef.current ?? [];
        if (JSON.stringify(currentData) !== JSON.stringify(previousData)) {
            const updatedTotalData = [...totalData, ...currentData];
            setTotalData(updatedTotalData);
            prevDataRef.current = currentData;
        }
    }, [data, totalData]);

    return totalData;
};
