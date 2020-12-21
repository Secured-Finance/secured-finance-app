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
	color: ${props => props.theme.colors.darkBlue};
	width: 100%;
	padding: 0;
`

const StyledTableHead  = styled.thead`
	tr:first-child { display: none; }
	background-color: #0F1D25;
`

const StyledTableRow = styled.tr`
	td:first-child { padding-left: ${(props) => props.theme.spacing[3]+2}px }
	td:last-child { padding-right: ${(props) => props.theme.spacing[3]+2}px }
`

const StyledTableHeaderText = styled.td`
	font-size: ${(props) => props.theme.sizes.caption}px;
	color: ${props => props.theme.colors.darkBlue};
	text-transform: uppercase;
    font-weight: 500;
    height: 30px;
`

const StyledTableBody = styled.tbody`
	tr {
		text-align: left;
		color: #DEE8F0;
		font-size: ${(props) => props.theme.sizes.caption}px;
	}

	tr:nth-child(even) {
		background-color: #0F1D25;
	}
	td:first-child { padding-left: ${(props) => props.theme.spacing[3]+2}px }
	td:last-child { padding-right: ${(props) => props.theme.spacing[3]+2}px }
`

const StyledTableBodyItem = styled.td`
	padding: ${(props) => props.theme.spacing[1]}px 0;
	font-weight: 500;
`

export default PositionsTable
