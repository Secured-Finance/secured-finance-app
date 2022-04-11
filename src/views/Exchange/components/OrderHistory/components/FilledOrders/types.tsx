import { CurrencyContainer } from 'src/components/atoms';
import theme from 'src/theme';
import { formatDateAndTime, ordinaryFormat, percentFormat } from 'src/utils';
import { RenderTerms, TableColumns } from '../commonTypes';

export interface FilledOrdersTableData {
    orderId: number;
    side: number;
    currency: string;
    amount: number;
    rate: number;
    term: string;
    counterparty: string;
    createdAtTimestamp: number;
}

export const filledTableCollumns = [
    {
        Header: '',
        id: 'positions',
        isHiddenHeader: false,
        columns: [
            {
                Header: 'Side',
                accessor: 'side',
                Cell: (cell: { value: number }) =>
                    cell.value === 0 ? (
                        <span style={{ color: theme.colors.red3 }}>Lender</span>
                    ) : (
                        <span style={{ color: theme.colors.green }}>
                            Borrower
                        </span>
                    ),
            },
            {
                Header: 'Currency',
                accessor: 'currency',
                Cell: (cell: { value: string }) => (
                    <CurrencyContainer
                        ccy={cell.value}
                        size={'xs'}
                        short={true}
                        style={{
                            justifyContent: 'flex-start',
                        }}
                    />
                ),
            },
            {
                Header: 'Amount',
                accessor: 'amount',
                Cell: (cell: { value: number }) => (
                    <span>
                        {cell.value != null ? ordinaryFormat(cell.value) : 0}
                    </span>
                ),
            },
            {
                Header: 'Rate',
                accessor: 'rate',
                Cell: (cell: { value: number }) => (
                    <span>
                        {cell.value != null
                            ? percentFormat(cell.value, 10000)
                            : 0}
                    </span>
                ),
            },
            {
                Header: 'Term',
                accessor: 'term',
                Cell: (cell: { value: number }) => (
                    <RenderTerms index={cell.value} />
                ),
            },
            {
                Header: 'Filled at',
                accessor: 'createdAtTimestamp',
                Cell: (cell: { value: number }) => (
                    <span>
                        {cell.value != null ? formatDateAndTime(cell.value) : 0}
                    </span>
                ),
            },
            {
                Header: 'Counterparty',
                accessor: 'counterparty',
                Cell: (cell: { value: string }) => <span>{cell.value}</span>,
            },
        ],
    },
] as Array<TableColumns>;
