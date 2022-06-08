import { Currency } from '@secured-finance/sf-graph-client/dist/generated';
import { RenderTerms } from 'src/components/atoms/RenderTerms';
import { AddressUtils, ordinaryFormat, percentFormat } from 'src/utils';

export interface TableColumns {
    Header: string;
    id: string;
    isHiddenHeader: boolean;
    columns: Array<Columns>;
    isSorted?: boolean;
    isSortedDesc?: boolean;
}

interface Columns {
    Header: string;
    accessor: string;
    Cell: (cell: { value: string | number }) => JSX.Element;
}

interface IndexProps {
    index?: number | string;
}

const RenderState: React.FC<IndexProps> = ({ index }) => {
    switch (index) {
        case 0:
            return (
                <div>
                    <button
                        style={{
                            padding: '4px 10px',
                            background: '#EFE2D0',
                            borderRadius: 15,
                            color: '#C79556',
                            fontSize: 13,
                            fontWeight: 700,
                            outline: 'none',
                            border: 'none',
                        }}
                    >
                        Registered
                    </button>
                </div>
            );
        case 1:
            return (
                <div>
                    <button
                        style={{
                            padding: '4px 10px',
                            background: '#ABE3B8',
                            borderRadius: 15,
                            color: '#48835D',
                            fontSize: 13,
                            fontWeight: 700,
                            margin: 0,
                            outline: 'none',
                            border: 'none',
                        }}
                    >
                        Working
                    </button>
                </div>
            );
        case 2:
            return (
                <div>
                    <button
                        style={{
                            padding: '4px 10px',
                            background: '#EFE2D0',
                            borderRadius: 15,
                            color: '#C79556',
                            fontSize: 13,
                            fontWeight: 700,
                            outline: 'none',
                            border: 'none',
                        }}
                    >
                        Due
                    </button>
                </div>
            );
        case 3:
            return (
                <div>
                    <button
                        style={{
                            padding: '4px 10px',
                            background: '#F8D8D8',
                            borderRadius: 15,
                            color: '#D5534E',
                            fontSize: 13,
                            fontWeight: 700,
                            outline: 'none',
                            border: 'none',
                        }}
                    >
                        Past Due
                    </button>
                </div>
            );
        case 4:
            return <div style={{ padding: '4px, 10px' }}>Closed</div>;
        case 5:
            return <div style={{ padding: '4px, 10px' }}>Terminated</div>;
        default:
            break;
    }
};

export const historyTableColumns = [
    {
        Header: '',
        id: 'transactions',
        isHiddenHeader: false,
        columns: [
            {
                Header: 'Lender',
                accessor: 'lender',
                Cell: (cell: { value: string }) => (
                    <span>{AddressUtils.format(cell.value, 18)}</span>
                ),
            },
            {
                Header: 'Borrower',
                accessor: 'borrower',
                Cell: (cell: { value: string }) => (
                    <span>{AddressUtils.format(cell.value, 18)}</span>
                ),
            },
            {
                Header: 'Side',
                accessor: 'side',
                Cell: (cell: { value: number }) =>
                    cell.value === 0 ? (
                        <span>Lender</span>
                    ) : (
                        <span>Borrower</span>
                    ),
            },
            {
                Header: 'Rate',
                accessor: 'rate',
                Cell: (cell: { value: number }) => (
                    <span>{percentFormat(cell.value, 10000)}</span>
                ),
            },
            {
                Header: 'Notional',
                accessor: 'notional',
                Cell: (cell: { value: number }) => (
                    <span>
                        {cell.value != null ? ordinaryFormat(cell.value) : 0}
                    </span>
                ),
            },
            {
                Header: 'Currency',
                accessor: 'currency',
                Cell: (cell: { value: Currency }) => (
                    <span>{cell.value.shortName}</span>
                ),
            },
            {
                Header: 'Term',
                accessor: 'term',
                Cell: (cell: { value: string }) => (
                    <RenderTerms label={'termIndex'} value={cell.value} />
                ),
            },
            {
                Header: 'State',
                accessor: 'state',
                Cell: (cell: { value: number }) => (
                    <RenderState index={cell.value} />
                ),
            },
        ],
    },
] as Array<TableColumns>;
