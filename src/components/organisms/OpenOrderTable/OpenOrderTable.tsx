import { PencilIcon, TrashIcon } from '@heroicons/react/outline';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { CoreTable } from 'src/components/molecules';
import { Order } from 'src/components/organisms';
import { OrderList } from 'src/types';
import {
    amountColumnDefinition,
    contractColumnDefinition,
    loanTypeColumnDefinition,
    priceYieldColumnDefinition,
} from 'src/utils/tableDefinitions';

const columnHelper = createColumnHelper<Order>();

export const OpenOrderTable = ({ data }: { data: OrderList }) => {
    const columns = useMemo(
        () => [
            loanTypeColumnDefinition(columnHelper, 'Type', 'type'),
            contractColumnDefinition(
                columnHelper,
                'Contract',
                'contract',
                'compact'
            ),
            priceYieldColumnDefinition(
                columnHelper,
                'Price',
                'price',
                row => row.unitPrice,
                'compact'
            ),
            priceYieldColumnDefinition(
                columnHelper,
                'APY%',
                'yield',
                row => row.unitPrice,
                'compact',
                'rate'
            ),
            amountColumnDefinition(
                columnHelper,
                'Amount',
                'amount',
                row => row.amount,
                { compact: true, color: false }
            ),
            columnHelper.display({
                id: 'actions',
                cell: () => (
                    <div className='flex flex-row justify-center gap-3 text-planetaryPurple'>
                        <PencilIcon className='h-4' />
                        <TrashIcon className='h-4' />
                    </div>
                ),
                header: () => <div>Actions</div>,
            }),
        ],
        []
    );

    return (
        <CoreTable
            columns={columns}
            data={data.filter(order => order.status === 'Open')}
            name='open-order-table'
            border={false}
        />
    );
};
