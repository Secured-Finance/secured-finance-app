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
    border,
    name = 'core-table',
    hoverRow,
}: {
    data: Array<T>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: ColumnDef<T, any>[];
    onLineClick?: (rowId: string) => void;
    border: boolean;
    name?: string;
    hoverRow?: (rowId: string) => boolean;
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
                                className='px-1 py-2 text-center'
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
                        className={classNames('relative h-7 transform-none', {
                            'cursor-pointer': hoverRow?.(row.id),
                            'hover:bg-black-30': hoverRow?.(row.id),
                            'border-b border-white-10': border,
                        })}
                        onClick={() =>
                            hoverRow?.(row.id) && onLineClick?.(row.id)
                        }
                        data-testid={`${name}-row`}
                    >
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className='px-1 py-2 text-center'>
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
