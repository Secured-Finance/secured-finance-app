import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    TableOptions,
    useReactTable,
} from '@tanstack/react-table';
import classNames from 'classnames';
import { useState } from 'react';

export const CoreTable = <T,>({
    data,
    columns,
    onLineClick,
    name = 'core-table',
}: {
    data: Array<T>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: ColumnDef<T, any>[];
    onLineClick?: () => void;
    name?: string;
}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const configuration = {
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
    } as TableOptions<T>;

    const table = useReactTable<T>(configuration);
    return (
        <table className='h-full w-full text-white' data-testid={name}>
            <thead className='typography-caption-2 h-14 border-b border-white-10 py-4 px-6 text-slateGray'>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} data-testid={`${name}-header`}>
                        {headerGroup.headers.map(header => (
                            <th
                                key={header.id}
                                className='px-4 py-2 text-center'
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
                            'cursor-pointer': onLineClick,
                        })}
                        onClick={onLineClick}
                        data-testid={`${name}-row`}
                    >
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className='px-4 py-2 text-center'>
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
};
