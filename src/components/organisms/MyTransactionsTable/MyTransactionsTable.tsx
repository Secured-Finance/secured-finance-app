import { createColumnHelper } from '@tanstack/react-table';
import { BigNumber } from 'ethers';
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

const getFVWithFee = (
    forwardValue: BigNumber,
    fee: BigNumber,
    side: number
) => {
    if (side === 0) {
        return forwardValue.sub(fee);
    }
    return forwardValue.add(fee);
};

export const MyTransactionsTable = ({
    data,
    pagination,
}: {
    data: TradeHistory;
    pagination?: Pagination;
}) => {
    const isTablet = useBreakpoint('laptop');
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
                        BigNumber.from(row.forwardValue),
                        BigNumber.from(row.feeInFV),
                        row.side
                    ),
                {
                    compact: true,
                    color: true,
                    fontSize: 'typography-caption-2',
                }
            ),
        ],
        []
    );

    const columnsForTabletMobile = [
        columns[1],
        columns[0],
        ...columns.slice(2),
    ];

    return (
        <div className='pb-2'>
            <CoreTable
                data={data}
                columns={isTablet ? columnsForTabletMobile : columns}
                options={{
                    name: 'my-transactions-table',
                    border: false,
                    stickyColumns: new Set([0, 1]),
                    pagination: pagination,
                }}
            />
        </div>
    );
};
