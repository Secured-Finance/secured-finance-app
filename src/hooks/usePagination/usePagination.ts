import { useEffect, useRef, useState } from 'react';

const arraysAreEqual = <Q>(arr1: Q[], arr2: Q[]) =>
    arr1.length === arr2.length &&
    arr1.every(
        (value, index) => JSON.stringify(value) === JSON.stringify(arr2[index])
    );

const updateData = <T extends { id: string | number }>(
    prevData: T[],
    newData: T[]
): T[] => {
    const idToItemMap = new Map(prevData.map(item => [item.id, item]));
    for (const newItem of newData) {
        idToItemMap.set(newItem.id, newItem);
    }
    return Array.from(idToItemMap.values());
};

export const usePagination = <T extends { id: string | number }>(
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
            if (!arraysAreEqual(previousData, currentData)) {
                const updatedTotalData = updateData(totalData, currentData);
                setTotalData(updatedTotalData);
                prevDataRef.current = currentData;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, data, dataUser]);

    return totalData;
};
