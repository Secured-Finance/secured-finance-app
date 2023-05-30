import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import classNames from 'classnames';
import { useState } from 'react';

export const CoreTable = <T,>({
    data,
    columns,
    onLineClick,
    border,
    name = 'core-table',
    hoverRow,
    hideColumnIds,
}: {
    data: Array<T>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: ColumnDef<T, any>[];
    onLineClick?: (rowId: string) => void;
    border: boolean;
    name?: string;
    hoverRow?: (rowId: string) => boolean;
    hideColumnIds?: string[];
}) => {
    const [sorting, setSorting] = useState<SortingState>([]);

    const filteredColumns = columns.filter(column => {
        if (hideColumnIds === undefined || column.id === undefined) {
            return true;
        }
        return !hideColumnIds.includes(column.id);
    });

    const configuration = {
        data,
        columns: filteredColumns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
    };

    const table = useReactTable<T>(configuration);
    return (
        <div className='table-container overflow-x-auto '>
            <table
                className='w-full  bg-black-20 text-white'
                data-testid={name}
            >
                <thead className='typography-caption-2 opacity/100 h-14 border-b border-white-10 px-6 py-4 text-slateGray'>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} data-testid={`${name}-header`}>
                            {headerGroup.headers.map((header, columnIndex) => (
                                <td
                                    key={header.id}
                                    className={classNames(
                                        'relative px-1 py-2 text-center',
                                        {
                                            'sticky left-0 bg-black-20/100':
                                                columnIndex === 0,
                                        }
                                    )}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr
                            key={row.id}
                            className={classNames('relative h-7', {
                                'cursor-pointer': hoverRow?.(row.id),
                                'hover:bg-black-30': hoverRow?.(row.id),
                                'border-b border-white-10': border,
                            })}
                            onClick={() =>
                                hoverRow?.(row.id) && onLineClick?.(row.id)
                            }
                            data-testid={`${name}-row`}
                        >
                            {row.getVisibleCells().map((cell, cellIndex) => (
                                <td
                                    key={cell.id}
                                    className={classNames(
                                        'px-1 py-2 text-center ',
                                        {
                                            'sticky left-0 z-10 bg-black-20/100':
                                                cellIndex === 0,
                                        }
                                    )}
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
