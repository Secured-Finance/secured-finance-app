import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { CoreTable } from 'src/components/molecules';
import { TradeHistory } from 'src/types';
import { formatLoanValue, formatTimestamp } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import {
    amountColumnDefinition,
    contractColumnDefinition,
    loanTypeColumnDefinition,
    tableHeaderDefinition,
} from 'src/utils/tableDefinitions';

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
        header: tableHeaderDefinition(headerTitle),
    });
};

const timestampColumnDef = (headerTitle: string) => {
    return columnHelper.accessor('createdAt', {
        cell: info => {
            return (
                <div className='typography-caption text-slateGray'>
                    {formatTimestamp(+info.getValue().toString())}
                </div>
            );
        },
        header: tableHeaderDefinition(headerTitle),
    });
};

export const MyTransactionsTable = ({ data }: { data: TradeHistory }) => {
    const columns = useMemo(
        () => [
            loanTypeColumnDefinition(columnHelper, 'Type', 'type'),
            contractColumnDefinition(
                columnHelper,
                'Contract',
                'contract',
                'compact'
            ),
            amountColumnDefinition(
                columnHelper,
                'Amount',
                'amount',
                row => row.amount,
                { compact: true, color: true }
            ),
            priceYieldColumnDef('Price/DF', 'price', 'price'),
            priceYieldColumnDef('APR%', 'apr', 'rate'),
            amountColumnDefinition(
                columnHelper,
                'F.V.',
                'forwardValue',
                row => row.forwardValue,
                { compact: true, color: true }
            ),
            timestampColumnDef('Date and Time'),
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
