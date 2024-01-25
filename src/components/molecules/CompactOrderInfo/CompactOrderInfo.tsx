import { OrderSide } from '@secured-finance/sf-client';
import { getUTCMonthYear } from '@secured-finance/sf-core';
import classNames from 'classnames';
import { useState } from 'react';
import { CurrencyIcon } from 'src/components/atoms';
import { RemoveOrderDialog } from 'src/components/organisms';
import { Order } from 'src/hooks';
import {
    CurrencySymbol,
    currencyMap,
    formatLoanValue,
    hexToCurrencySymbol,
} from 'src/utils';
import { Amount, LoanValue, Maturity } from 'src/utils/entities';

type Props = { data?: OpenOrder[] };

export type OpenOrder = Order & { calculationDate?: number };

export default function CompactOrderInfo({ data }: Props) {
    const [removeOrderDialogData, setRemoveOrderDialogData] = useState<{
        orderId: bigint;
        maturity: Maturity;
        amount: Amount;
        side: OrderSide;
        isOpen: boolean;
        orderUnitPrice: number;
    }>();

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

                const formattedLoanValue = formatLoanValue(loanValue, 'price');
                const formattedLoanApr = formatLoanValue(loanValue, 'rate');
                const amount = currencyMap[ccy as CurrencySymbol].fromBaseUnit(
                    order.amount as bigint
                );

                const text = side.toString() === '1' ? 'Borrow' : 'Lend';

                return (
                    <div className='px-5' key={`order-info-${i}`}>
                        <div
                            className={classNames(
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
                                        <h2 className='text-[0.9375rem] font-semibold'>
                                            {contract}
                                        </h2>
                                        <span
                                            className={classNames(
                                                'flex w-[45px] items-center justify-center rounded-full px-[0.375rem] py-[0.125rem] text-[0.625rem]',
                                                {
                                                    'bg-[#FFE5E8] text-[#FF324B]':
                                                        order.side.toString() ===
                                                        '1',
                                                    'bg-[#E4FFE7] text-[#10991D]':
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
                                    className='max-h-7 overflow-hidden rounded-md border border-[#C4CAFF] px-[0.625rem] py-1 text-xs font-semibold leading-none text-[#C4CAFF]'
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
                                            orderUnitPrice: Number(unitPrice),
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                            <div className='text-xs text-[#E2E8F0]'>
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
                                            <span>{formattedLoanValue}</span>
                                        </li>
                                    )}
                                    <li className='flex justify-between'>
                                        <span>APR%</span>
                                        <span>{formattedLoanApr}</span>
                                    </li>
                                    {!!amount && (
                                        <li className='flex justify-between'>
                                            <span>Amount</span>
                                            <span>
                                                {amount} {ccy || ''}
                                            </span>
                                        </li>
                                    )}
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
}
