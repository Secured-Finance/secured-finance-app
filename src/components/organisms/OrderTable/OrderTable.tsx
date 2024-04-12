import { XMarkIcon } from '@heroicons/react/24/solid';
import { OrderSide } from '@secured-finance/sf-client';
import { getUTCMonthYear } from '@secured-finance/sf-core';
import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { CurrencyIcon } from 'src/components/atoms';
import { CoreTable, TableActionMenu } from 'src/components/molecules';
import { RemoveOrderDialog } from 'src/components/organisms';
import { Order } from 'src/hooks';
import {
    CurrencySymbol,
    currencyMap,
    formatLoanValue,
    formatTimestamp,
    hexToCurrencySymbol,
    ordinaryFormat,
} from 'src/utils';
import { Amount, LoanValue, Maturity } from 'src/utils/entities';
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

    const CompactOrderInfo = ({ data }: { data?: OpenOrder[] }) => {
        if (!data || data.length === 0) return null;

        return (
            <>
                {data.map((order: OpenOrder, i: number) => {
                    const unitPrice = order.unitPrice;
                    const ccy = hexToCurrencySymbol(order.currency);
                    const maturity = new Maturity(order.maturity);
                    const side = order.side;

                    const contract = `${ccy} ${getUTCMonthYear(
                        maturity.toNumber()
                    )}`;

                    const calculationDate = order.calculationDate;
                    const loanValue = LoanValue.fromPrice(
                        Number(unitPrice.toString()),
                        Number(order.maturity.toString()),
                        calculationDate
                    );

                    const formattedLoanValue = formatLoanValue(
                        loanValue,
                        'price'
                    );
                    const formattedLoanApr = formatLoanValue(loanValue, 'rate');
                    const amount = currencyMap[
                        ccy as CurrencySymbol
                    ].fromBaseUnit(order.amount as bigint);
                    const formattedAmount = ordinaryFormat(amount, 0, 2);

                    const text = side.toString() === '1' ? 'Borrow' : 'Lend';

                    return (
                        <div className='px-5' key={`order-info-${i}`}>
                            <div
                                className={clsx(
                                    'flex flex-col gap-4 border-neutral-600 py-4 text-[#FBFAFC]',
                                    { 'border-b': i !== data.length - 1 }
                                )}
                            >
                                <div className='flex justify-between'>
                                    <div className='flex gap-2'>
                                        <CurrencyIcon
                                            ccy={ccy as CurrencySymbol}
                                            variant='large'
                                        />
                                        <div className='flex flex-col items-start gap-1'>
                                            <h2 className='text-[15px] font-semibold'>
                                                {contract}
                                            </h2>
                                            <span
                                                className={clsx(
                                                    'flex h-[17px] w-[45px] items-center justify-center rounded-[5px] border px-[0.375rem] py-[0.125rem] text-2xs',
                                                    {
                                                        'border-error-300 bg-error-300/10 text-error-300':
                                                            order.side.toString() ===
                                                            '1',
                                                        'border-success-300 bg-success-300/10 text-success-300':
                                                            order.side.toString() !==
                                                            '1',
                                                    }
                                                )}
                                            >
                                                {text}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        className='h-[22px] overflow-hidden rounded-md border border-neutral-600 bg-neutral-50 px-2.5 py-1 text-2xs font-semibold leading-none text-neutral-600'
                                        onClick={() => {
                                            const amount = BigInt(order.amount);
                                            setRemoveOrderDialogData({
                                                orderId: order.orderId,
                                                maturity,
                                                amount: new Amount(
                                                    amount,
                                                    ccy as CurrencySymbol
                                                ),
                                                side: side,
                                                isOpen: true,
                                                orderUnitPrice:
                                                    Number(unitPrice),
                                            });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <div className='text-xs leading-4 text-[#E2E8F0]'>
                                    <ul className='flex w-full flex-col gap-[0.375rem]'>
                                        {!!contract && (
                                            <li className='flex justify-between'>
                                                <span>Contract</span>
                                                <span>{contract}</span>
                                            </li>
                                        )}
                                        {!!formattedLoanValue && (
                                            <li className='flex justify-between'>
                                                <span>Price</span>
                                                <span>
                                                    {formattedLoanValue}
                                                </span>
                                            </li>
                                        )}
                                        <li className='flex justify-between'>
                                            <span>APR%</span>
                                            <span>{formattedLoanApr}</span>
                                        </li>
                                        {!!amount && (
                                            <li className='flex justify-between'>
                                                <span>Amount</span>
                                                <span>{formattedAmount}</span>
                                            </li>
                                        )}
                                        <li className='flex justify-between'>
                                            <span>Transaction time</span>
                                            <span>
                                                {formatTimestamp(
                                                    +order.createdAt.toString()
                                                )}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    );
                })}

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
