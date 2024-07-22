import { XMarkIcon } from '@heroicons/react/24/solid';
import { OrderSide } from '@secured-finance/sf-client';
import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import {
    Button,
    ButtonSizes,
    ButtonVariants,
    HorizontalListItemTable,
} from 'src/components/atoms';
import {
    CoreTable,
    TableActionMenu,
    TableCardHeader,
} from 'src/components/molecules';
import { RemoveOrderDialog } from 'src/components/organisms';
import { Order, useBreakpoint } from 'src/hooks';
import {
    AmountCell,
    OrderTimeCell,
    amountColumnDefinition,
    contractColumnDefinition,
    dateAndTimeColumnDefinition,
    hexToCurrencySymbol,
    loanTypeColumnDefinition,
    priceYieldColumnDefinition,
} from 'src/utils';
import { Amount, Maturity } from 'src/utils/entities';

export type OpenOrder = Order & { calculationDate?: number };

const columnHelper = createColumnHelper<OpenOrder>();

const DEFAULT_HEIGHT = 300;

type RemoveOrderDialogDataType = {
    orderId: bigint;
    maturity: Maturity;
    amount: Amount;
    side: OrderSide;
    isOpen: boolean;
    orderUnitPrice: number;
};

const OrderTableMobile = ({
    data,
    cancelOrder,
}: {
    data: OpenOrder[];
    cancelOrder: (v: RemoveOrderDialogDataType) => void;
}) => {
    if (!data || data.length === 0) return null;

    return data.map((row, index) => {
        const ccy = hexToCurrencySymbol(row.currency);
        const maturity = new Maturity(row.maturity);
        const side =
            row.side.toString() === '1' ? OrderSide.BORROW : OrderSide.LEND;
        const amount = row.amount;
        const unitPrice = row.unitPrice;
        const orderId = row.orderId;
        const timestamp = Number(row.createdAt);
        const calculationDate = row.calculationDate;

        return (
            ccy && (
                <div
                    className={clsx(
                        'flex w-full flex-col gap-2.5 bg-neutral-900 px-5 py-4',
                        {
                            'border-b border-neutral-600':
                                index !== data.length - 1,
                        }
                    )}
                    key={index}
                >
                    <TableCardHeader
                        currency={ccy}
                        maturity={maturity}
                        side={side}
                        price={Number(unitPrice)}
                        calculationDate={calculationDate}
                    />
                    <div className='flex flex-col gap-[3px]'>
                        <HorizontalListItemTable
                            label='Order Amount'
                            value={<AmountCell ccy={ccy} amount={amount} />}
                        />
                        <HorizontalListItemTable
                            label='Order Time'
                            value={<OrderTimeCell timestamp={timestamp} />}
                        />
                    </div>
                    <Button
                        size={ButtonSizes.sm}
                        fullWidth
                        variant={ButtonVariants.secondary}
                        onClick={() =>
                            cancelOrder({
                                orderId: orderId,
                                maturity: maturity,
                                amount: new Amount(amount, ccy),
                                side: side,
                                isOpen: true,
                                orderUnitPrice: Number(unitPrice),
                            })
                        }
                    >
                        Cancel
                    </Button>
                </div>
            )
        );
    });
};

export const OrderTable = ({
    data,
    variant = 'default',
    height,
}: {
    data: OpenOrder[];
    variant?: 'compact' | 'default';
    height?: number;
}) => {
    const isTablet = useBreakpoint('laptop');
    const [removeOrderDialogData, setRemoveOrderDialogData] =
        useState<RemoveOrderDialogDataType>();
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

    return (
        <>
            {isTablet ? (
                <OrderTableMobile
                    data={data}
                    cancelOrder={v => setRemoveOrderDialogData(v)}
                />
            ) : (
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
                    }}
                />
            )}
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
