import React from 'react';
import { useTable } from 'react-table';
import { TableColumns, walletTableColumns } from './types';

// TODO: Fix the types here as they are not coherent
const WalletsTable = ({ table }: { table: any }): JSX.Element => {
    const columns = React.useMemo(() => walletTableColumns, []);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable<TableColumns>({ columns, data: table });

    return (
        <table
            className='w-full rounded border-2 border-tableBorder text-white'
            {...getTableProps()}
        >
            <thead className='bg-tableHeader'>
                {headerGroups.map(headerGroup => (
                    <tr
                        className='text-center'
                        {...headerGroup.getHeaderGroupProps()}
                    >
                        {headerGroup.headers.map(column => {
                            return (
                                <td
                                    className='p-5 text-center text-subhead font-bold'
                                    {...column.getHeaderProps()}
                                >
                                    <div className='flex flex-row items-center justify-center'>
                                        {column.render('Header')}
                                    </div>
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </thead>
            <tbody
                className='text-center text-subhead'
                {...getTableBodyProps()}
            >
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return (
                                    <td
                                        className='p-5'
                                        {...cell.getCellProps()}
                                    >
                                        {cell.render('Cell')}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default WalletsTable;
