import React from 'react'
import styled from 'styled-components'
import { useTable } from 'react-table'
import { positionsTableColumns } from './types'
import { testData } from './testData'

const STATE = [
	"REGISTERED",
	"WORKING",
	"DUE",
	"PAST_DUE",
	"CLOSED",
	"TERMINATED",
];  

function PositionsTable() {
	const columns = React.useMemo(() => positionsTableColumns,[])
	const data = React.useMemo(() => testData,[])
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
	} = useTable(
		{ columns, data },
	)

	return (
		<StyledTable {...getTableProps()}>
			<StyledTableHead>
				{headerGroups.map(headerGroup => (
					<StyledTableRow {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column) => {
							return column.isHiddenHeader === false ? null : (
								<StyledTableHeaderText {...column.getHeaderProps()}>
										{column.render('Header')}
								</StyledTableHeaderText>
							);
						})}
					</StyledTableRow>
				))}
			</StyledTableHead>
			<StyledTableBody {...getTableBodyProps()}>
				{rows.map((row, i) => {
					prepareRow(row)
					return (
						<tr {...row.getRowProps()}>
							{row.cells.map(cell => {
								return <StyledTableBodyItem {...cell.getCellProps()}>{cell.render('Cell')}</StyledTableBodyItem>
							})}
						</tr>
					)
				})}
			</StyledTableBody>
		</StyledTable>
	)
}

const StyledTable = styled.table`
	border-spacing: 0;
	width: 100%;
	padding: 0;
	margin-top: ${(props) => props.theme.spacing[1]}px;
`

const StyledTableHead  = styled.thead`
	tr:first-child { display: none; }
`

const StyledTableRow = styled.tr`
	td:first-child { 
		padding-left: ${(props) => props.theme.spacing[3]+4}px;
		text-align: center;
	}
	td:last-child { 
		text-align: center; 
	}
`

const StyledTableHeaderText = styled.td`
	font-size: ${(props) => props.theme.sizes.caption5}px;
	color: ${props => props.theme.colors.gray};
	text-transform: uppercase;
    font-weight: 500;
    height: 30px;
	padding: 0;
	text-align: right;
`

const StyledTableBody = styled.tbody`
	td {
		text-align: right;
		color: #DEE8F0;
		font-size: ${(props) => props.theme.sizes.caption3}px;
	}

	td:first-child { 
		padding-left: ${(props) => props.theme.spacing[3]+4}px;
		text-align: center;
	}
	td:last-child { 
		text-align: center; 
	}
`

const StyledTableBodyItem = styled.td`
	padding: ${(props) => props.theme.spacing[1]}px 0;
	font-weight: 500;
`

export default PositionsTable
