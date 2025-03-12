import { Row } from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react';
import { OrderBookEntry } from 'src/hooks';

// Types for the hook
type FlashType = 'add' | 'update' | 'remove';

interface FlashRecord {
    timestamp: number;
    type: FlashType;
    expiration: number;
}

type FlashMap = Record<string, FlashRecord>;

// Default flash styles - can be overridden
const defaultFlashStyles: Record<FlashType, string> = {
    add: 'bg-green-200',
    update: 'bg-blue-200',
    remove: 'bg-red-200',
};

// Options for the hook
interface UseFlashRowsOptions {
    /** Duration of the flash effect in milliseconds */
    flashDuration?: number;
    /** Custom styles to apply for each flash type */
    flashStyles?: Partial<Record<FlashType, string>>;
    /** Function to extract the unique ID from a data item */
    getRowId?: (row: Row<OrderBookEntry>) => string;
    /** Custom comparison function to determine if a row has changed */
    isRowChanged?: (
        oldRow: Row<OrderBookEntry>,
        newRow: Row<OrderBookEntry>
    ) => boolean;
}

/**
 * A hook that tracks changes in table data and provides flash styling for rows
 * that have been added, updated, or removed.
 */
export function useFlashRows(
    initialData: Row<OrderBookEntry>[] = [],
    options: UseFlashRowsOptions = {}
) {
    // Default options
    const {
        flashDuration = 2000,
        flashStyles = {},
        getRowId = (row: Row<OrderBookEntry>) => row.id,
        isRowChanged = (
            oldRow: Row<OrderBookEntry>,
            newRow: Row<OrderBookEntry>
        ) => JSON.stringify(oldRow) !== JSON.stringify(newRow),
    } = options;

    // Merge default and custom flash styles
    const mergedFlashStyles = {
        ...defaultFlashStyles,
        ...flashStyles,
    };

    // State and refs
    const [data, setData] = useState<Row<OrderBookEntry>[]>(initialData);
    const [flashMap, setFlashMap] = useState<FlashMap>({});
    const dataRef = useRef<Record<string, Row<OrderBookEntry>>>({});
    const flashStoreRef = useRef<FlashMap>({});

    // Initialize dataRef with current data
    useEffect(() => {
        const dataMap: Record<string, Row<OrderBookEntry>> = {};
        data.forEach(item => {
            const id = getRowId(item);
            dataMap[id] = item;
        });
        dataRef.current = dataMap;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update data and track changes
    const updateData = (newData: Row<OrderBookEntry>[]) => {
        const currentTime = Date.now();
        const newDataMap: Record<string, Row<OrderBookEntry>> = {};
        const newFlashes: FlashMap = {};
        const flashStore = flashStoreRef.current;

        // Identify new and updated rows
        newData.forEach(item => {
            const id = getRowId(item);
            newDataMap[id] = item;

            // If item exists in flash store with valid expiration, keep its flash state
            if (flashStore[id] && flashStore[id].expiration > currentTime) {
                newFlashes[id] = flashStore[id];
            }
            // New item
            else if (!dataRef.current[id]) {
                const flashRecord = {
                    timestamp: currentTime,
                    type: 'add' as const,
                    expiration: currentTime + flashDuration,
                };
                newFlashes[id] = flashRecord;
                flashStore[id] = flashRecord;
            }
            // Updated item
            else if (
                dataRef.current[id] &&
                isRowChanged(dataRef.current[id], item)
            ) {
                const flashRecord = {
                    timestamp: currentTime,
                    type: 'update' as const,
                    expiration: currentTime + flashDuration,
                };
                newFlashes[id] = flashRecord;
                flashStore[id] = flashRecord;
            }
        });

        // Identify removed rows (not needed in the component but tracked in the store)
        Object.keys(dataRef.current).forEach(id => {
            if (!newDataMap[id]) {
                const flashRecord = {
                    timestamp: currentTime,
                    type: 'remove' as const,
                    expiration: currentTime + flashDuration,
                };
                // Don't add to newFlashes since item won't be rendered
                flashStore[id] = flashRecord;
            }
        });

        // Update refs and state
        dataRef.current = newDataMap;
        flashStoreRef.current = flashStore;
        setData(newData);
        setFlashMap(newFlashes);
    };

    // Clean up expired flash entries
    useEffect(() => {
        const cleanup = () => {
            const currentTime = Date.now();
            let hasExpired = false;
            const flashStore = flashStoreRef.current;

            // Clean flash store
            Object.keys(flashStore).forEach(key => {
                if (flashStore[key].expiration < currentTime) {
                    delete flashStore[key];
                    hasExpired = true;
                }
            });

            // Update component state if needed
            if (hasExpired) {
                setFlashMap(prev => {
                    const newFlashMap: FlashMap = {};
                    Object.keys(prev).forEach(key => {
                        if (prev[key].expiration >= currentTime) {
                            newFlashMap[key] = prev[key];
                        }
                    });
                    return newFlashMap;
                });
            }
        };

        const timer = setInterval(cleanup, 1000);
        return () => clearInterval(timer);
    }, []);

    // Function to get the style for a row based on its ID
    const getRowFlashStyle = (rowId: string): string => {
        if (!flashMap[rowId]) return '';
        return mergedFlashStyles[flashMap[rowId].type] || '';
    };

    return {
        data,
        updateData,
        getRowFlashStyle,
        flashMap,
    };
}
