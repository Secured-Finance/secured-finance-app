import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import {
    CoreTable,
    Pagination,
    TableActionMenu,
} from 'src/components/molecules';
import { useBlockExplorerUrl, useBreakpoint, useLastPrices } from 'src/hooks';
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

export const OrderHistoryTable = ({
    data,
    pagination,
    variant = 'default',
}: {
    data: OrderHistoryList;
    pagination?: Pagination;
    variant?: 'compact' | 'default';
}) => {
    const { data: priceList } = useLastPrices();
    const isTablet = useBreakpoint('laptop');
    const { blockExplorerUrl } = useBlockExplorerUrl();

    const columns = useMemo(
        () => [
            contractColumnDefinition(
                columnHelper,
                'Symbol',
                'contract',
                variant,
                undefined,
                'left',
                'left'
            ),
            loanTypeColumnDefinition(columnHelper, 'Type', 'type'),
            inputPriceYieldColumnDefinition(
                columnHelper,
                'Price',
                'price',
                row => row.inputUnitPrice
            ),
            inputAmountColumnDefinition(
                columnHelper,
                'Order Amount',
                'amount',
                row => row.inputAmount,
                {
                    compact: true,
                    color: false,
                    priceList: priceList,
                    fontSize: 'typography-desktop-body-5',
                }
            ),
            amountColumnDefinition(
                columnHelper,
                'Filled Amount',
                'filledAmount',
                row => row.filledAmount,
                {
                    compact: true,
                    color: false,
                    priceList: priceList,
                    fontSize: 'typography-desktop-body-5',
                },
                '',
                'right'
            ),
            columnHelper.accessor('status', {
                cell: info => (
                    <div className='typography-desktop-body-5 flex justify-start text-white'>
                        {info.getValue()}
                    </div>
                ),
                header: tableHeaderDefinition('Status', '', 'left'),
            }),
            dateAndTimeColumnDefinition(
                columnHelper,
                'Order Time',
                'createdAt',
                row => row.createdAt
            ),
            columnHelper.display({
                id: 'actions',
                cell: info => {
                    const txHash = info.row.original.txHash;
                    const blockExplorerLink = blockExplorerUrl
                        ? `${blockExplorerUrl}/tx/${txHash}`
                        : '';
                    return (
                        <div className='flex justify-center'>
                            <TableActionMenu
                                items={[
                                    {
                                        text: 'View',
                                        onClick: () => {
                                            window.open(
                                                blockExplorerLink,
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
        [blockExplorerUrl, priceList, variant]
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
                border: false,
                compact: true,
            }}
        />
    );
};
