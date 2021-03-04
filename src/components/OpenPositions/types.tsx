import theme from "../../theme"
import { formatDate, formatDateAndTime, ordinaryFormat, percentFormat } from "../../utils"

interface PositionsTableProps {
    columns?: Array<TableColumns>,
    data?: Array<PositionsTableData>,
}

export interface TableColumns {
    Header: string,
    id: string,
    isHiddenHeader: boolean,
    columns: Array<Columns>,
    isSorted?: boolean,
    isSortedDesc?: boolean,
}

interface Columns {
    Header: string,
    accessor: string,
    Cell: any,
}

export interface PositionsTableData {
    side: number,
    ccy: string,
    amount: number,
    rate: number,
    term: string,
    collateral: number,
    coverage: number,
    start: number,
    end: number,
    state: string,
}

interface IndexProps {
    index?: string
}

export const RenderTerms: React.FC<IndexProps> = ({index}) => {
    switch (index) {
        case "0":
            return <span>3 Month</span>
        case "1":
            return <span>6 Month</span>
        case "2":
            return <span>1 Year</span>
        case "3":
            return <span>2 Years</span>
        case "4":
            return <span>3 Years</span> 
        case "5":
            return <span>5 Years</span>             
        default: 
            break
    }
}

export const positionsTableColumns = [{
    Header: '',
    id: 'positions',
    isHiddenHeader: false,
    columns: [
        {
            Header: 'Side',
            accessor: 'side',
            Cell: ( cell: { value: number } ) => ( cell.value === 0 ? <span style={{color: theme.colors.red3}}>Lender</span> : <span style={{color: theme.colors.green}}>Borrower</span>),
        },
        {
            Header: 'CCY',
            accessor: 'ccy',
            Cell: ( cell: { value: string } ) => <span>{cell.value}</span>
        },
        {
            Header: 'Amount',
            accessor: 'amount',
            Cell: ( cell : { value: any } ) => <span>{ cell.value != null ? ordinaryFormat(cell.value) : 0 }</span>
        },
        {
            Header: 'Rate',
            accessor: 'rate',
            Cell: ( cell : { value: any } ) => <span>{ cell.value != null ? percentFormat(cell.value) : 0 }</span>
        },
        {
            Header: 'Term',
            accessor: 'term',
            Cell: ( cell: { value: string } ) => <RenderTerms index={cell.value} />
        },
        {
            Header: 'Collateral',
            accessor: 'collateral',
            Cell: ( cell : { value: any } ) => <span>{ cell.value != null ? ordinaryFormat(cell.value) + " ETH" : 0 }</span>
        },
        {
            Header: 'Coverage',
            accessor: 'coverage',
            Cell: ( cell : { value: any } ) => <span style={{color: (cell.value < 125) ? theme.colors.red3 : theme.colors.white }}>{ cell.value != null ? percentFormat(cell.value) : percentFormat(0) }</span>
        },
        {
            Header: 'Start date & time',
            accessor: 'start',
            Cell: ( cell : { value: any } ) => <span>{ cell.value != null ? formatDateAndTime(cell.value) : 0 }</span>
        },
        {
            Header: 'Maturity',
            accessor: 'end',
            Cell: ( cell : { value: any } ) => <span>{ cell.value != null ? formatDate(cell.value) : 0 }</span>
        },
        {
            Header: 'State',
            accessor: 'state',
            Cell: ( cell : { value: any } ) => <span style={{color: (cell.value === "Liquidated") ? theme.colors.red3 : theme.colors.white }}>{cell.value}</span>
        },
    ]
}] as Array<TableColumns>