import React from 'react';
import { useSortBy, useTable } from 'react-table';
import { ArrowSVG } from 'src/components/atoms';
import { Td } from 'src/components/common/Td';
import styled from 'styled-components';
import { historyTableColumns } from './types';

const STATE = [
    'REGISTERED',
    'WORKING',
    'DUE',
    'PAST_DUE',
    'CLOSED',
    'TERMINATED',
];

const HistoryTable = ({ table }) => {
    const columns = React.useMemo(() => historyTableColumns, []);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data: table }, useSortBy);

    return (
        <StyledTable {...getTableProps()}>
            <StyledTableHead>
                {headerGroups.map(headerGroup => (
                    <StyledTableRow {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => {
                            return column.isHiddenHeader === false ? null : (
                                <StyledTableHeaderText
                                    {...column.getHeaderProps(
                                        column.getSortByToggleProps()
                                    )}
                                >
                                    <StyledTableItemContainer>
                                        {column.render('Header')}
                                        <StyledSVGContainer>
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
                                        </StyledSVGContainer>
                                    </StyledTableItemContainer>
                                </StyledTableHeaderText>
                            );
                        })}
                    </StyledTableRow>
                ))}
            </StyledTableHead>
            <StyledTableBody {...getTableBodyProps()}>
                {rows.map((row, i) => {
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
            </StyledTableBody>
        </StyledTable>
    );
};

const StyledTable = styled.table`
    border-spacing: 0;
    border: 1px solid #1c303f;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    color: ${props => props.theme.colors.white};
    width: 100%;

    tr:first-child td:first-child {
        border-top-left-radius: 3px;
    }
    tr:first-child td:last-child {
        border-top-right-radius: 3px;
    }
`;

const StyledTableHead = styled.thead`
    tr:first-child {
        display: none;
    }
    background-color: #122735;
`;

const StyledTableRow = styled.tr`
    td:first-child {
        text-align: center;
    }
`;

const StyledTableItemContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

const StyledTableHeaderText = styled.td`
    font-weight: 700;
    font-size: ${props => props.theme.sizes.subhead}px;
    color: #ffffff;
    text-align: center;
    padding: ${props => props.theme.spacing[3] + 2}px 0;
`;

const StyledSVGContainer = styled.span`
    display: inline-block;
    margin-left: 2px;
`;

const StyledTableBody = styled.tbody`
    tr {
        text-align: center;
        font-size: ${props => props.theme.sizes.subhead}px;
        color: ${props => props.theme.colors.white};
    }

    tr:nth-child(even) {
        // background-color: #122735;
    }
`;

export default HistoryTable;
