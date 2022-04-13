import { RenderTerms } from 'src/components/atoms';
import theme from 'src/theme';
import {
    formatDateAndTime,
    fromBytes32,
    ordinaryFormat,
    percentFormat,
} from 'src/utils';
import RenderCancelButton from '../CancelButton';
import { TableColumns } from '../commonTypes';

export interface OrdersTableData {
    orderId: number;
    side: number;
    currency: string;
    amount: number;
    rate: number;
    term: string;
    createdAtTimestamp: number;
}

export const ordersTableColumns = [
    {
        Header: '',
        id: 'orders',
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
                    <span>{fromBytes32(cell.value)}</span>
                    // <CurrencyContainer
                    //     ccy={cell.value}
                    //     size={'xs'}
                    //     short={true}
                    //     style={{
                    //         justifyContent: 'flex-start',
                    //     }}
                    // />
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
                Header: 'Placed at',
                accessor: 'createdAtTimestamp',
                Cell: (cell: { value: number }) => (
                    <span>
                        {cell.value != null ? formatDateAndTime(cell.value) : 0}
                    </span>
                ),
            },
            {
                Header: '',
                accessor: 'orderId',
                Cell: (cell: { value: any }) => (
                    <RenderCancelButton orderId={cell.value} />
                ),
            },
        ],
    },
] as Array<TableColumns>;
