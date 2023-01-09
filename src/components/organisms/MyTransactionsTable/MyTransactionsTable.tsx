import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Chip, CurrencyItem } from 'src/components/atoms';
import {
    CoreTable,
    TableContractCell,
    TableHeader,
} from 'src/components/molecules';
import { TradeHistory } from 'src/types';
import { currencyMap, CurrencySymbol, formatLoanValue } from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import { hexToString } from 'web3-utils';

const columnHelper = createColumnHelper<TradeHistory[0]>();

const priceYieldColumnDef = (
    headerTitle: string,
    id: string,
    formatType: Parameters<typeof formatLoanValue>[1]
) => {
    return columnHelper.accessor('averagePrice', {
        id: id,
        cell: info => {
            return (
                <div className='flex justify-center'>
                    <span className='typography-caption-2 h-6 text-neutral-6'>
                        {formatLoanValue(
                            LoanValue.fromPrice(
                                Number(info.getValue().toString()),
                                Number(info.row.original.maturity)
                            ),
                            formatType
                        )}
                    </span>
                </div>
            );
        },
        header: header => (
            <TableHeader
                title={headerTitle}
                sortingHandler={header.column.getToggleSortingHandler()}
                isSorted={header.column.getIsSorted()}
            />
        ),
    });
};

const amountColumnDef = (
    headerTitle: string,
    id: string,
    accessor: keyof TradeHistory[0],
    color: boolean
) => {
    return columnHelper.accessor(accessor, {
        id: id,
        cell: info => {
            const ccy = hexToString(
                info.row.original.currency
            ) as CurrencySymbol;

            return (
                <div className='flex justify-end'>
                    <CurrencyItem
                        amount={currencyMap[ccy].fromBaseUnit(info.getValue())}
                        ccy={ccy}
                        align='right'
                        color={
                            color
                                ? info.row.original.side === 1
                                    ? 'negative'
                                    : 'positive'
                                : undefined
                        }
                        compact
                    />
                </div>
            );
        },
        header: header => (
            <TableHeader
                title={headerTitle}
                sortingHandler={header.column.getToggleSortingHandler()}
                isSorted={header.column.getIsSorted()}
            />
        ),
    });
};

export const MyTransactionsTable = ({ data }: { data: TradeHistory }) => {
    const columns = useMemo(
        () => [
            columnHelper.accessor('side', {
                cell: info => (
                    <div className='flex justify-center'>
                        <Chip
                            label={
                                info.getValue().toString() === '1'
                                    ? 'Borrow'
                                    : 'Lend'
                            }
                        />
                    </div>
                ),
                header: header => (
                    <TableHeader
                        title='Type'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
            columnHelper.accessor('maturity', {
                id: 'contract',
                cell: info => (
                    <div className='flex justify-center'>
                        <TableContractCell
                            maturity={new Maturity(info.getValue())}
                            ccyByte32={info.row.original.currency}
                            variant='compact'
                        />
                    </div>
                ),
                header: header => (
                    <TableHeader
                        title='Contract'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
            amountColumnDef('Amount', 'amount', 'amount', true),
            priceYieldColumnDef('Price/DF', 'price', 'price'),
            priceYieldColumnDef('APY%', 'apy', 'rate'),
            amountColumnDef('F.V.', 'forwardValue', 'forwardValue', true),
            columnHelper.display({
                id: 'actions',
                cell: () => <div>...</div>,
                header: () => <div>Actions</div>,
            }),
        ],
        []
    );

    return (
        <div className='pb-2'>
            <CoreTable
                data={data}
                columns={columns}
                name='active-trade-table'
                border={false}
            />
        </div>
    );
};
