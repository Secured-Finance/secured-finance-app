import { CurrencyContainer } from 'src/components/atoms';
import { WalletBase } from 'src/store/wallets';
import { AddressUtils } from 'src/utils';
import {
    RenderActions,
    RenderBalance,
    RenderPortfolio,
    RenderPrice,
} from './components';
import { ActionProps } from './components/Actions';
export interface WalletTableData {
    asset: string;
    address: string;
    balance: number;
    growth: number;
    price: number;
    portfolio: number;
    actions: never;
    isAvailable: boolean;
}

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
        value: string | number | ActionProps['callbackMap'];
        row: { original: WalletBase; values: WalletBase };
    }) => JSX.Element;
}

export const walletTableColumns = [
    {
        Header: '',
        id: 'wallets',
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
                Header: 'Address',
                accessor: 'address',
                Cell: (cell: { value: string }) => (
                    <span data-cy='old-wallet-address'>
                        {AddressUtils.format(cell.value, 24)}
                    </span>
                ),
            },
            {
                Header: 'Balance',
                accessor: 'balance',
                Cell: cell => (
                    <RenderBalance
                        balance={cell.value as number}
                        index={cell.row.values.ccyIndex}
                        value={cell.row.original.usdBalance}
                    />
                ),
            },
            {
                Header: 'Price',
                accessor: 'assetPrice',
                Cell: cell => (
                    <RenderPrice
                        price={cell.value as number}
                        dailyChange={cell.row.original.dailyChange}
                    />
                ),
            },
            {
                Header: 'Portfolio',
                accessor: 'portfolioShare',
                Cell: (cell: { value: number }) => (
                    <RenderPortfolio share={cell.value} />
                ),
            },
            {
                Header: 'Actions',
                accessor: 'actions',
                Cell: cell => (
                    <RenderActions
                        callbackMap={cell.value as ActionProps['callbackMap']}
                        ccyIndex={cell.row.values.ccyIndex}
                    />
                ),
            },
        ],
    },
] as Array<TableColumns>;
