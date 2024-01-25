import { XMarkIcon } from '@heroicons/react/24/solid';
import { OrderSide } from '@secured-finance/sf-client';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { CoreTable, TableActionMenu } from 'src/components/molecules';
import CompactOrderInfo from 'src/components/molecules/CompactOrderInfo/CompactOrderInfo';
import { RemoveOrderDialog } from 'src/components/organisms';
import { Order, useBreakpoint } from 'src/hooks';
import { activeOrders, preOpenOrders } from 'src/stories/mocks/fixtures';
import { hexToCurrencySymbol } from 'src/utils';
import { Amount, Maturity } from 'src/utils/entities';
import {
    amountColumnDefinition,
    contractColumnDefinition,
    dateAndTimeColumnDefinition,
    loanTypeColumnDefinition,
    priceYieldColumnDefinition,
} from 'src/utils/tableDefinitions';

export type OpenOrder = Order & { calculationDate?: number };

const columnHelper = createColumnHelper<OpenOrder>();

const DEFAULT_HEIGHT = 300;

export const OrderTable = ({
    data,
    variant = 'default',
    height,
}: {
    data: OpenOrder[];
    variant?: 'compact' | 'default';
    height?: number;
}) => {
    const [removeOrderDialogData, setRemoveOrderDialogData] = useState<{
        orderId: bigint;
        maturity: Maturity;
        amount: Amount;
        side: OrderSide;
        isOpen: boolean;
        orderUnitPrice: number;
    }>();
    const columns = useMemo(
        () => [
            contractColumnDefinition(
                columnHelper,
                'Contract',
                'contract',
                variant === 'default' ? 'compact' : 'contractOnly',
                undefined,
                'left'
            ),
            loanTypeColumnDefinition(columnHelper, 'Type', 'type'),
            priceYieldColumnDefinition(
                columnHelper,
                'Price',
                'price',
                row => row.unitPrice,
                'compact'
            ),
            priceYieldColumnDefinition(
                columnHelper,
                'APR%',
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
                {
                    compact: true,
                    color: false,
                    fontSize: 'typography-caption-2',
                }
            ),
            dateAndTimeColumnDefinition(
                columnHelper,
                'Order Time',
                'createdAt',
                row => row.createdAt
            ),
            columnHelper.display({
                id: 'actions',
                cell: info => {
                    const ccy = hexToCurrencySymbol(info.row.original.currency);
                    if (!ccy) return null;

                    const side =
                        info.row.original.side === 0
                            ? OrderSide.LEND
                            : OrderSide.BORROW;

                    const amount = BigInt(info.row.original.amount);
                    const removeOrder = () => {
                        setRemoveOrderDialogData({
                            orderId: info.row.original.orderId,
                            maturity: new Maturity(info.row.original.maturity),
                            amount: new Amount(amount, ccy),
                            side: side,
                            isOpen: true,
                            orderUnitPrice: Number(info.row.original.unitPrice),
                        });
                    };

                    return (
                        <div className='flex justify-center'>
                            {variant === 'default' && (
                                <TableActionMenu
                                    items={[
                                        {
                                            text: 'Remove Order',
                                            onClick: removeOrder,
                                        },
                                    ]}
                                />
                            )}
                            {variant === 'compact' && (
                                <button
                                    className='group h-5 w-5 hover:bg-white-10'
                                    aria-label='Remove Order'
                                    onClick={removeOrder}
                                >
                                    <XMarkIcon className='h-5 w-5 text-secondary7 group-hover:text-starBlue group-active:text-starBlue' />
                                </button>
                            )}
                        </div>
                    );
                },
                header: () => <div className='p-2'>Actions</div>,
            }),
        ],
        [variant]
    );
    const isMobile = useBreakpoint('tablet');

    return (
        <>
            <CompactOrderInfo
                data={[
                    ...activeOrders,
                    ...activeOrders,
                    ...activeOrders,
                    ...preOpenOrders,
                ]}
            />
            <CoreTable
                columns={
                    variant === 'compact'
                        ? columns.filter(column => column.id !== 'createdAt')
                        : columns
                }
                data={data}
                options={{
                    name: 'open-order-table',
                    stickyFirstColumn: true,
                    pagination: {
                        containerHeight: height || DEFAULT_HEIGHT,
                        getMoreData: () => {},
                        totalData: data.length,
                    },
                    showHeaders: !isMobile,
                }}
                CustomRowComponent={<CompactOrderInfo data={data} />}
            />
            {removeOrderDialogData && (
                <RemoveOrderDialog
                    {...removeOrderDialogData}
                    onClose={() =>
                        setRemoveOrderDialogData({
                            ...removeOrderDialogData,
                            isOpen: false,
                        })
                    }
                />
            )}
        </>
    );
};
