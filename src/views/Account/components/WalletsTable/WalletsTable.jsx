import React from 'react'
import styled from 'styled-components'
import { useTable } from 'react-table'
import { walletTableColumns } from './types'

const WalletsTable = ({table}) => {
	const columns = React.useMemo(() => walletTableColumns,[])
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
	} = useTable(
		{ columns, data:table },
	)
	
	return (
		<StyledTable {...getTableProps()}>
			<StyledTableHead>
				{headerGroups.map(headerGroup => (
					<StyledTableRow {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column) => {
							return column.isHiddenHeader === false ? null : (
								<StyledTableHeaderText {...column.getHeaderProps()}>
									<StyledTableItemContainer>
										{column.render('Header')}
									</StyledTableItemContainer>
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
	border: 1px solid #1C303F;
	border-top-left-radius: 4px;
	border-top-right-radius: 4px;
	border-bottom-left-radius: 4px;
	border-bottom-right-radius: 4px;
	color: ${props => props.theme.colors.white};
	width: 100%;

	tr:first-child td:first-child { border-top-left-radius: 3px; }
	tr:first-child td:last-child { border-top-right-radius: 3px; }
`

const StyledTableHead  = styled.thead`
	tr:first-child { display: none; }
	background-color: #122735;
`

const StyledTableRow = styled.tr`
	td:first-child { text-align: center; }
`

const StyledTableItemContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
`

const StyledTableHeaderText = styled.td`
	font-weight: 700;
	font-size: ${(props) => props.theme.sizes.subhead}px;
	color: #FFFFFF;
	text-align: center;
	padding: ${(props) => props.theme.spacing[3]+2}px 0;
`

const StyledTableBody = styled.tbody`
	tr {
		text-align: center;
		font-size: ${(props) => props.theme.sizes.subhead}px;
		color: ${(props) => props.theme.colors.white};
	}
`

const StyledTableBodyItem = styled.td`
	padding: ${(props) => props.theme.spacing[3]+2}px 0;
`

export default WalletsTable
