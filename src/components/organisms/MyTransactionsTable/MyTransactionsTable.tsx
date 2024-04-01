import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { CoreTable, Pagination } from 'src/components/molecules';
import { useBreakpoint } from 'src/hooks';
import { Transaction, TransactionHistoryList } from 'src/types';
import { formatLoanValue } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import {
    amountColumnDefinition,
    contractColumnDefinition,
    loanTypeColumnDefinition,
    tableHeaderDefinition,
} from 'src/utils/tableDefinitions';

const columnHelper = createColumnHelper<Transaction>();

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

const getFVWithFee = (futureValue: bigint, fee: bigint, side: number) => {
    if (side === 0) {
        return futureValue - fee;
    }
    return futureValue + fee;
};

export const MyTransactionsTable = ({
    data,
    pagination,
    variant = 'compact',
}: {
    data: TransactionHistoryList;
    pagination?: Pagination;
    variant?: 'contractOnly' | 'compact';
}) => {
    const isTablet = useBreakpoint('laptop');
    const isMobile = useBreakpoint('tablet');
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
                'futureValue',
                row =>
                    getFVWithFee(
                        BigInt(row.futureValue),
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
                showHeaders: !isMobile,
            }}
        />
    );
};
