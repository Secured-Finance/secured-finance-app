import { OrderSide } from '@secured-finance/sf-client';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { CoreTable, TableActionMenu } from 'src/components/molecules';
import { RemoveOrderDialog } from 'src/components/organisms';
import { Order } from 'src/hooks';
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
    height,
}: {
    data: OpenOrder[];
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
                'Symbol',
                'contract',
                'compact',
                undefined,
                'left',
                'left'
            ),
            loanTypeColumnDefinition(columnHelper, 'Type', 'type'),
            priceYieldColumnDefinition(
                columnHelper,
                'Order Price',
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
                'Order Amount',
                'amount',
                row => row.amount,
                {
                    compact: true,
                    color: false,
                    fontSize: 'typography-caption-2',
                },
                '',
                'right'
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
                        <TableActionMenu
                            items={[
                                {
                                    text: 'Cancel',
                                    onClick: removeOrder,
                                },
                            ]}
                        />
                    );
                },
                header: () => (
                    <div className='flex justify-start p-2'>Actions</div>
                ),
            }),
        ],
        []
    );

    return (
        <>
            <CoreTable
                columns={columns}
                data={data}
                options={{
                    name: 'open-order-table',
                    stickyFirstColumn: true,
                    pagination: {
                        containerHeight: height || DEFAULT_HEIGHT,
                        getMoreData: () => {},
                        totalData: data.length,
                    },
                    border: false,
                    compact: true,
                }}
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
