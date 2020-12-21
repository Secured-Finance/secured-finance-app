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
}

export interface PositionsTableData {
    action: string,
    pair: string,
    amount: number,
    rate: number,
    term: string,
    pv: number,
    state: string,
}

export const positionsTableColumns = [{
    Header: '',
    id: 'positions',
    isHiddenHeader: false,
    columns: [
        {
            Header: 'Action',
            accessor: 'action',
        },
        {
            Header: 'Pair',
            accessor: 'pair',
        },
        {
            Header: 'Amount',
            accessor: 'amount',
        },
        {
            Header: 'Rate',
            accessor: 'rate',
        },
        {
            Header: 'Term',
            accessor: 'term',
        },
        {
            Header: 'PV',
            accessor: 'pv',
        },
        {
            Header: 'State',
            accessor: 'state',
        },
    ]
}] as Array<TableColumns>