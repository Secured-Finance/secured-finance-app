/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { useCallback, useState } from 'react';

type CoreTableOptions = {
    name: string;
    hoverDirection: 'up' | 'down';
    onLineClick?: (rowId: string) => void;
    hoverRow?: (rowId: string) => boolean;
    hideColumnIds?: string[];
    showHeaders?: boolean;
    isFirstRowLoading?: boolean;
    isLastRowLoading?: boolean;
};

const DEFAULT_OPTIONS: CoreTableOptions = {
    name: 'core-table',
    hoverDirection: 'up',
    onLineClick: undefined,
    hoverRow: undefined,
    hideColumnIds: undefined,
    showHeaders: true,
};

export const CoreTable = <T,>({
    data,
    columns,
    options = DEFAULT_OPTIONS,
}: {
    data: Array<T>;
    columns: ColumnDef<T, any>[];
    options?: Partial<CoreTableOptions>;
}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [activeRow, setActiveRow] = useState<string>();
    const coreTableOptions: CoreTableOptions = {
        ...DEFAULT_OPTIONS,
        ...options,
    };

    const onHoverBackground = useCallback(
        (rowId: string) => {
            if (coreTableOptions.hoverDirection === 'up') {
                return activeRow && Number(rowId) >= Number(activeRow);
            } else if (coreTableOptions.hoverDirection === 'down') {
                return activeRow && Number(rowId) <= Number(activeRow);
            }
        },
        [activeRow, coreTableOptions.hoverDirection]
    );

    const filteredColumns = columns.filter(column => {
        if (
            coreTableOptions.hideColumnIds === undefined ||
            column.id === undefined
        ) {
            return true;
        }
        return !coreTableOptions.hideColumnIds.includes(column.id);
    });

    const configuration = {
        data: data,
        columns: filteredColumns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
    };

    const table = useReactTable<T>(configuration);
    const rows = table.getRowModel().rows;

    const isLoading = (rowIndex: number, dataRows: number) =>
        (options.isFirstRowLoading && rowIndex === 0) ||
        (options.isLastRowLoading && rowIndex === dataRows - 1);

    return (
        <table
            className='w-full table-fixed'
            data-testid={coreTableOptions.name}
        >
            {coreTableOptions.showHeaders ? (
                <thead className='font-secondary text-2xs leading-4 text-neutral-400 laptop:h-7 laptop:py-1 laptop:text-xs laptop:leading-5 laptop:text-neutral-300'>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr
                            key={headerGroup.id}
                            data-testid={`${coreTableOptions.name}-header`}
                        >
                            {headerGroup.headers.map(header => (
                                <th
                                    data-testid={`${coreTableOptions.name}-header-cell`}
                                    key={header.id}
                                    className='whitespace-nowrap pb-1 text-center font-normal laptop:px-5 laptop:pb-0'
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
            ) : null}

            <tbody>
                {rows.map((row, rowIndex) =>
                    isLoading(rowIndex, rows.length) ? (
                        <tr key={rowIndex} className='animate-pulse'>
                            <td colSpan={row.getVisibleCells().length}>
                                <div className='h-[22px] min-w-fit bg-[#808080]/20'></div>
                            </td>
                        </tr>
                    ) : (
                        <tr
                            key={row.id}
                            className={clsx(
                                'h-4 w-full border-transparent laptop:h-[23px]',
                                {
                                    'border-t':
                                        coreTableOptions.hoverDirection ===
                                        'up',
                                    'border-b':
                                        coreTableOptions.hoverDirection ===
                                        'down',
                                    'cursor-pointer bg-neutral-100/10':
                                        coreTableOptions.hoverRow?.(row.id) &&
                                        activeRow &&
                                        coreTableOptions.hoverRow?.(
                                            activeRow
                                        ) &&
                                        onHoverBackground(row.id),
                                    'border-z-neutral-100 border-dashed':
                                        coreTableOptions.hoverRow?.(row.id) &&
                                        activeRow &&
                                        coreTableOptions.hoverRow?.(
                                            activeRow
                                        ) &&
                                        Number(row.id) === Number(activeRow),
                                }
                            )}
                            onClick={() =>
                                coreTableOptions.hoverRow?.(row.id) &&
                                coreTableOptions.onLineClick?.(row.id)
                            }
                            onMouseEnter={() => setActiveRow(row.id)}
                            onMouseLeave={() => setActiveRow(undefined)}
                            data-testid={`${coreTableOptions.name}-row`}
                        >
                            {row.getVisibleCells().map(cell => (
                                <td
                                    key={cell.id}
                                    className='min-w-fit whitespace-nowrap font-normal'
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    )
                )}
            </tbody>
        </table>
    );
};
