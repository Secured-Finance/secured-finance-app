import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import {
    CoreTable,
    Pagination,
    TableActionMenu,
} from 'src/components/molecules';
import { useBreakpoint, useEtherscanUrl, useLastPrices } from 'src/hooks';
import { Order, OrderHistoryList } from 'src/types';
import {
    amountColumnDefinition,
    contractColumnDefinition,
    dateAndTimeColumnDefinition,
    inputAmountColumnDefinition,
    inputPriceYieldColumnDefinition,
    loanTypeColumnDefinition,
    tableHeaderDefinition,
} from 'src/utils/tableDefinitions';

const columnHelper = createColumnHelper<Order>();

const getStatus = (status: string) => {
    switch (status) {
        case 'PartiallyBlocked':
            return 'Partially Blocked';
        case 'PartiallyFilled':
            return 'Partially Filled';
        default:
            return status;
    }
};

export const OrderHistoryTable = ({
    data,
    pagination,
    variant = 'default',
}: {
    data: OrderHistoryList;
    pagination?: Pagination;
    variant?: 'contractOnly' | 'default';
}) => {
    const { data: priceList } = useLastPrices();
    const isTablet = useBreakpoint('laptop');
    const etherscanUrl = useEtherscanUrl();

    const columns = useMemo(
        () => [
            loanTypeColumnDefinition(columnHelper, 'Type', 'type'),
            contractColumnDefinition(
                columnHelper,
                'Contract',
                'contract',
                variant
            ),
            inputPriceYieldColumnDefinition(
                columnHelper,
                'Price',
                'price',
                row => row.inputUnitPrice
            ),
            amountColumnDefinition(
                columnHelper,
                'Filled Amount',
                'filledAmount',
                row => row.filledAmount,
                { compact: false, color: true, priceList: priceList }
            ),
            inputAmountColumnDefinition(
                columnHelper,
                'Amount',
                'amount',
                row => row.inputAmount,
                { compact: false, color: true, priceList: priceList }
            ),
            columnHelper.accessor('status', {
                cell: info => (
                    <div className='typography-caption'>
                        {getStatus(info.getValue())}
                    </div>
                ),
                header: tableHeaderDefinition('Status'),
            }),
            dateAndTimeColumnDefinition(
                columnHelper,
                'Order Time',
                'createdAt',
                row => row.createdAt,
                'typography-caption'
            ),
            columnHelper.display({
                id: 'actions',
                cell: info => {
                    const txHash = info.row.original.txHash;
                    const etherscanLink = etherscanUrl
                        ? `${etherscanUrl}/tx/${txHash}`
                        : '';
                    return (
                        <div className='flex justify-center'>
                            <TableActionMenu
                                items={[
                                    {
                                        text: 'View',
                                        onClick: () => {
                                            window.open(
                                                etherscanLink,
                                                '_blank'
                                            );
                                        },
                                    },
                                ]}
                            />
                        </div>
                    );
                },
                header: () => <div className='p-2'>Actions</div>,
            }),
        ],
        [etherscanUrl, priceList, variant]
    );

    const columnsForTabletMobile = [
        columns[1],
        columns[0],
        ...columns.slice(2),
    ];

    return (
        <CoreTable
            columns={isTablet ? columnsForTabletMobile : columns}
            data={data}
            options={{
                name: 'order-history-table',
                stickyFirstColumn: true,
                pagination: pagination,
            }}
        />
    );
};
