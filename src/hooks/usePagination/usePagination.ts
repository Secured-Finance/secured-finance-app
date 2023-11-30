import { useEffect, useRef, useState } from 'react';

export const usePagination = <T>(
    data: T[],
    dataUser: string | undefined,
    currentUser: string | undefined
) => {
    const [totalData, setTotalData] = useState<T[]>([]);
    const prevDataRef = useRef<T[]>([]);

    useEffect(() => {
        if (
            dataUser &&
            currentUser &&
            dataUser?.toLowerCase() !== currentUser?.toLowerCase()
        ) {
            setTotalData([]);
            prevDataRef.current = [];
        } else {
            const currentData = data;
            const previousData = prevDataRef.current ?? [];
            if (JSON.stringify(currentData) !== JSON.stringify(previousData)) {
                const updatedTotalData = [...totalData, ...currentData];
                setTotalData(updatedTotalData);
                prevDataRef.current = currentData;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, data, dataUser]);

    return totalData;
};
