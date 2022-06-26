import React from 'react';
import { useTable } from 'react-table';
import { WalletBase } from 'src/store/wallets';
import { walletTableColumns } from './types';

const WalletsTable = ({ table }: { table: Array<WalletBase> }): JSX.Element => {
    const columns = React.useMemo(() => walletTableColumns, []);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable<WalletBase>({ columns, data: table });

    return (
        <table
            className='w-full rounded border-2 border-tableBorder text-white'
            {...getTableProps()}
        >
            <thead className='bg-tableHeader'>
                {headerGroups.map((headerGroup, index) => (
                    <tr
                        key={`header-${index}`}
                        className={index === 1 ? 'text-center' : 'hidden'}
                        {...headerGroup.getHeaderGroupProps()}
                    >
                        {headerGroup.headers.map(column => {
                            return (
                                <td
                                    key={column.id}
                                    className='p-5 text-center text-sm font-bold'
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
                className='text-subhead text-center'
                {...getTableBodyProps()}
            >
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr key={`row-${i}`} {...row.getRowProps()}>
                            {row.cells.map((cell, j) => {
                                return (
                                    <td
                                        key={`row-${i}-cell-${j}`}
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
