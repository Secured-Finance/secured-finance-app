import BigNumber from 'bignumber.js';
import { CurrencyContainer } from 'src/components/atoms';
import { CollateralBook } from 'src/hooks/useCollateralBook/useCollateralBook';
import { AddressUtils } from 'src/utils';
import { RenderBorrow, RenderCollateral } from './components';

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
    Cell: (cell: {
        value: string | number | BigNumber;
        row: { original: CollateralBook };
    }) => JSX.Element;
}

const RenderState = ({ index }: { index?: string }) => {
    switch (index) {
        case '0':
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
                        Empty
                    </button>
                </div>
            );
        case '1':
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
                        Available
                    </button>
                </div>
            );
        case '2':
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
                            outline: 'none',
                            border: 'none',
                        }}
                    >
                        In Use
                    </button>
                </div>
            );
        case '3':
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
                        Margin Call
                    </button>
                </div>
            );
        case '4':
            return <div style={{ padding: '4px, 10px' }}>Liquidation</div>;
        case '5':
            return <div style={{ padding: '4px, 10px' }}>Liquidated</div>;
        default:
            return <div></div>;
    }
};

export const collateralTableColumns = [
    {
        Header: '',
        id: 'collateral',
        isHiddenHeader: false,
        columns: [
            {
                Header: 'Asset',
                accessor: 'ccyIndex',
                Cell: (cell: { value: number }) => (
                    <CurrencyContainer
                        ccy={cell.value}
                        short={false}
                        wallet={true}
                    />
                ),
            },
            {
                Header: 'Vault',
                accessor: 'vault',
                Cell: cell => (
                    <span>{AddressUtils.format(cell.value as string, 24)}</span>
                ),
            },
            {
                Header: 'Collateral',
                accessor: 'collateral',
                Cell: cell => (
                    <RenderCollateral
                        collateral={cell.value as BigNumber}
                        shortName={cell.row.original.ccyName}
                        value={cell.row.original.usdCollateral.toNumber()}
                    />
                ),
            },
            {
                Header: 'Locked',
                accessor: 'locked',
                Cell: cell => (
                    <RenderBorrow
                        locked={cell.value as BigNumber}
                        value={cell.row.original.usdLocked?.toNumber()}
                        shortName={cell.row.original.ccyName}
                    />
                ),
            },
            {
                Header: 'State',
                accessor: 'state',
                Cell: _ => <RenderState index={'1'} />,
            },
        ],
    },
] as Array<TableColumns>;
