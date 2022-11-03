import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

export const CoreTable = <T,>({
    data,
    columns,
    onLineClick,
}: {
    data: Array<T>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: ColumnDef<T, any>[];
    onLineClick?: () => void;
}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const table = useReactTable<T>({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });
    return (
        <table className='w-full text-white'>
            <thead className='typography-caption-2 h-14 border-b border-white-10 py-4 px-6 text-slateGray'>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} data-testid='core-table-header'>
                        {headerGroup.headers.map(header => (
                            <th key={header.id}>
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
                        className='cursor-pointer'
                        onClick={onLineClick}
                        data-testid='core-table-row'
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
