import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { CoreTable, Pagination } from 'src/components/molecules';
import { useBreakpoint } from 'src/hooks';
import { TradeHistory } from 'src/types';
import { formatLoanValue } from 'src/utils';
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
                                Number(info.getValue().toString() * 10000), //TODO: remove this hack
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

const getFVWithFee = (forwardValue: bigint, fee: bigint, side: number) => {
    if (side === 0) {
        return forwardValue - fee;
    }
    return forwardValue + fee;
};

export const MyTransactionsTable = ({
    data,
    pagination,
    variant = 'default',
}: {
    data: TradeHistory;
    pagination?: Pagination;
    variant?: 'contractOnly' | 'default';
}) => {
    const isTablet = useBreakpoint('laptop');
    const columns = useMemo(
        () => [
            loanTypeColumnDefinition(columnHelper, 'Type', 'type'),
            contractColumnDefinition(
                columnHelper,
                'Contract',
                'contract',
                variant
            ),
            amountColumnDefinition(
                columnHelper,
                'Amount',
                'amount',
                row => row.amount,
                { compact: true, color: true, fontSize: 'typography-caption-2' }
            ),
            priceYieldColumnDef('Price/DF', 'price', 'price'),
            priceYieldColumnDef('APR%', 'apr', 'rate'),
            amountColumnDefinition(
                columnHelper,
                'FV',
                'forwardValue',
                row =>
                    getFVWithFee(
                        BigInt(row.forwardValue),
                        BigInt(row.feeInFV),
                        row.side
                    ),
                {
                    compact: true,
                    color: true,
                    fontSize: 'typography-caption-2',
                }
            ),
        ],
        [variant]
    );

    const columnsForTabletMobile = [
        columns[1],
        columns[0],
        ...columns.slice(2),
    ];

    return (
        <CoreTable
            data={data}
            columns={isTablet ? columnsForTabletMobile : columns}
            options={{
                name: 'my-transactions-table',
                stickyFirstColumn: true,
                pagination: pagination,
            }}
        />
    );
};
