import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CoreTable, TableActionMenu } from 'src/components/molecules';
import { useBreakpoint, useEtherscanUrl } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { OrderHistoryList, Pagination } from 'src/types';
import {
    amountColumnDefinition,
    contractColumnDefinition,
    loanTypeColumnDefinition,
    priceYieldColumnDefinition,
    tableHeaderDefinition,
    dateAndTimeColumnDefinition,
    inputAmountColumnDefinition,
} from 'src/utils/tableDefinitions';

export type Order = OrderHistoryList[0];

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
}: {
    data: OrderHistoryList;
    pagination?: Pagination;
}) => {
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const isTablet = useBreakpoint('laptop');
    const etherscanUrl = useEtherscanUrl();

    const columns = useMemo(
        () => [
            loanTypeColumnDefinition(columnHelper, 'Type', 'type'),
            contractColumnDefinition(columnHelper, 'Contract', 'contract'),
            priceYieldColumnDefinition(
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
                                        text: 'View on Etherscan',
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
        [etherscanUrl, priceList]
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
                stickyColumns: new Set([7]),
                pagination: pagination,
            }}
        />
    );
};
