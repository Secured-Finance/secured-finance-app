import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Chip, CurrencyItem, PriceYieldItem } from 'src/components/atoms';
import {
    CoreTable,
    TableContractCell,
    TableHeader,
} from 'src/components/molecules';
import { OrderList } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import { hexToString } from 'web3-utils';

type Order = OrderList[0];

const columnHelper = createColumnHelper<Order>();

export const OrderHistoryTable = ({ data }: { data: OrderList }) => {
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
                cell: info => (
                    <div className='flex justify-center'>
                        <TableContractCell
                            maturity={info.getValue()}
                            ccyByte32={info.row.original.currency}
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
            columnHelper.accessor('unitPrice', {
                cell: info => (
                    <div className='flex justify-center'>
                        <PriceYieldItem
                            loanValue={LoanValue.fromPrice(
                                info.getValue().toString(),
                                info.row.original.maturity.toString()
                            )}
                            align='right'
                        />
                    </div>
                ),
                header: header => (
                    <TableHeader
                        title='Price'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
            columnHelper.accessor('amount', {
                cell: info => (
                    <div>
                        <CurrencyItem
                            amount={info.getValue().toString()}
                            ccy={
                                hexToString(
                                    info.row.original.currency
                                ) as CurrencySymbol
                            }
                            price={2}
                            align='right'
                            color={
                                info.row.original.side === 1
                                    ? 'negative'
                                    : 'positive'
                            }
                        />
                    </div>
                ),
                header: header => (
                    <TableHeader
                        title='Amount'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
            columnHelper.accessor('status', {
                cell: info => <div>{info.getValue().toString()}</div>,
                header: header => (
                    <TableHeader
                        title='Status'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
            columnHelper.display({
                id: 'actions',
                cell: () => <div>...</div>,
                header: () => <div>Actions</div>,
            }),
        ],
        []
    );

    return <CoreTable columns={columns} data={data} />;
};
