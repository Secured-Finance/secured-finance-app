import { useMemo } from 'react';
import { useSortBy, useTable } from 'react-table';
import { ArrowSVG } from 'src/components/atoms';
import { Td } from 'src/components/common/Td';
import { historyTableColumns } from './types';

const HistoryTable = ({ table }) => {
    const columns = useMemo(() => historyTableColumns, []);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data: table }, useSortBy);

    return (
        <table
            className='w-full rounded border-2 border-tableBorder text-white'
            {...getTableProps()}
        >
            <thead className='bg-tableHeader'>
                {headerGroups.map((headerGroup, index) => (
                    <tr
                        {...headerGroup.getHeaderGroupProps()}
                        className={index === 1 ? 'text-center' : 'hidden'}
                    >
                        {headerGroup.headers.map(column => {
                            return column.isHiddenHeader === false ? null : (
                                <td
                                    className='p-5 text-center text-subhead font-bold'
                                    {...column.getHeaderProps(
                                        column.getSortByToggleProps()
                                    )}
                                >
                                    <div className='flex flex-row items-center justify-center'>
                                        {column.render('Header')}
                                        <span className='ml-1 inline-block'>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <ArrowSVG
                                                        width={'15'}
                                                        height='6'
                                                        rotate={0}
                                                        fill='#3E6989'
                                                        stroke='#3E6989'
                                                    />
                                                ) : (
                                                    <ArrowSVG
                                                        width={'15'}
                                                        height='6'
                                                        rotate={180}
                                                        fill='#3E6989'
                                                        stroke='#3E6989'
                                                    />
                                                )
                                            ) : (
                                                <ArrowSVG
                                                    width={'15'}
                                                    height='6'
                                                    rotate={0}
                                                    fill='#3E6989'
                                                    stroke='#3E6989'
                                                />
                                            )}
                                        </span>
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
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return (
                                    <Td
                                        to={`/loan/${row.original.id}`}
                                        {...cell.getCellProps()}
                                    >
                                        {cell.render('Cell')}
                                    </Td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default HistoryTable;
