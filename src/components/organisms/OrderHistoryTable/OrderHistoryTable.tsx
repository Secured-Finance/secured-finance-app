import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CoreTable, TableActionMenu } from 'src/components/molecules';
import { useBreakpoint, useEtherscanUrl } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { OrderList } from 'src/types';
import {
    amountColumnDefinition,
    contractColumnDefinition,
    loanTypeColumnDefinition,
    priceYieldColumnDefinition,
    tableHeaderDefinition,
} from 'src/utils/tableDefinitions';

export type Order = OrderList[0];

const columnHelper = createColumnHelper<Order>();

const getStatus = (status: string) => {
    return status === 'PartiallyFilled' ? 'Partially Filled' : status;
};

export const OrderHistoryTable = ({ data }: { data: OrderList }) => {
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
                row => row.unitPrice
            ),
            amountColumnDefinition(
                columnHelper,
                'Filled Amount',
                'filledAmount',
                row => row.filledAmount,
                { compact: false, color: true, priceList: priceList }
            ),
            amountColumnDefinition(
                columnHelper,
                'Amount',
                'amount',
                row => row.amount,
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
                stickyColumns: new Set([6]),
            }}
        />
    );
};
