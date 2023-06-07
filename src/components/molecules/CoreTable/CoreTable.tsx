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

type CoreTableOptions = {
    border: boolean;
    name: string;
    onLineClick?: (rowId: string) => void;
    hoverRow?: (rowId: string) => boolean;
    hideColumnIds?: string[];
    responsive: boolean;
};

const DEFAULT_OPTIONS: CoreTableOptions = {
    border: true,
    name: 'core-table',
    onLineClick: undefined,
    hoverRow: undefined,
    hideColumnIds: undefined,
    responsive: true,
};

export const CoreTable = <T,>({
    data,
    columns,
    options = DEFAULT_OPTIONS,
}: {
    data: Array<T>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: ColumnDef<T, any>[];
    options?: Partial<CoreTableOptions>;
}) => {
    const [sorting, setSorting] = useState<SortingState>([]);

    const coreTableOptions: CoreTableOptions = {
        ...DEFAULT_OPTIONS,
        ...options,
    };

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

    const lastColumnIndex = columns.length - 1;

    const coreTable = (
        <table
            className='h-full w-full text-white'
            data-testid={coreTableOptions.name}
        >
            <thead className='typography-caption-2 h-14 border-b border-white-10 px-6 py-4 text-slateGray'>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr
                        key={headerGroup.id}
                        data-testid={`${coreTableOptions.name}-header`}
                    >
                        {headerGroup.headers.map((header, columnIndex) => (
                            <th
                                data-testid={`${coreTableOptions.name}-header-cell`}
                                key={header.id}
                                className={classNames(
                                    'relative px-1 py-2 text-center font-bold',
                                    {
                                        sticky:
                                            columnIndex === lastColumnIndex &&
                                            coreTableOptions.responsive,
                                        'right-0 bg-black-20/100':
                                            columnIndex === lastColumnIndex &&
                                            coreTableOptions.responsive,
                                    }
                                )}
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

            <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr
                        key={row.id}
                        className={classNames('relative h-7', {
                            'cursor-pointer': coreTableOptions.hoverRow?.(
                                row.id
                            ),
                            'hover:bg-black-30': coreTableOptions.hoverRow?.(
                                row.id
                            ),
                            'border-b border-white-10': coreTableOptions.border,
                        })}
                        onClick={() =>
                            coreTableOptions.hoverRow?.(row.id) &&
                            coreTableOptions.onLineClick?.(row.id)
                        }
                        data-testid={`${coreTableOptions.name}-row`}
                    >
                        {row.getVisibleCells().map((cell, cellIndex) => (
                            <td
                                key={cell.id}
                                className={classNames(
                                    'min-w-fit whitespace-nowrap px-1 py-2 text-center font-medium',
                                    {
                                        sticky:
                                            cellIndex === lastColumnIndex &&
                                            coreTableOptions.responsive,
                                        'right-0 bg-black-20/100':
                                            cellIndex === lastColumnIndex &&
                                            coreTableOptions.responsive,
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
    );

    if (coreTableOptions.responsive) {
        return (
            <div
                className={classNames({
                    'overflow-x-auto tablet:overflow-hidden':
                        coreTableOptions.responsive,
                })}
            >
                {coreTable}
            </div>
        );
    }

    return coreTable;
};
