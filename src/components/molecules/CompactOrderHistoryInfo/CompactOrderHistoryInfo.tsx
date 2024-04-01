import { getUTCMonthYear } from '@secured-finance/sf-core';
import clsx from 'clsx';
import { CurrencyIcon } from 'src/components/atoms';
import { getStatus } from 'src/components/organisms';
import { Order, OrderHistoryList } from 'src/types';
import {
    CurrencySymbol,
    currencyMap,
    formatLoanValue,
    formatTimestamp,
    hexToCurrencySymbol,
    ordinaryFormat,
} from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';

type Props = { data: OrderHistoryList };

export default function CompactOrderHistoryInfo({ data }: Props) {
    if (!data || data.length === 0) return null;

    return (
        <section>
            {data.map((order: Order, i: number) => {
                const unitPrice = order.inputUnitPrice;
                const ccy = hexToCurrencySymbol(order.currency);
                const maturity = new Maturity(order.maturity);
                const side = order.side.toString();

                const contract = `${ccy} ${getUTCMonthYear(
                    maturity.toNumber()
                )}`;

                // const calculationDate = order.calculationDate;
                const loanValue = LoanValue.fromPrice(
                    Number(unitPrice.toString()),
                    Number(order.maturity.toString()),
                    undefined
                );

                const formattedLoanValue = formatLoanValue(loanValue, 'price');
                const formattedLoanApr = formatLoanValue(loanValue, 'rate');

                const inputAmount =
                    order.type === 'Market' && order.status === 'Filled'
                        ? order.filledAmount
                        : order.inputAmount;

                const status = getStatus(order.status);

                const amount =
                    currencyMap[ccy as CurrencySymbol].fromBaseUnit(
                        inputAmount
                    );

                const roundingDecimal =
                    currencyMap[ccy as CurrencySymbol].roundingDecimal;
                const amountDisplay = ordinaryFormat(
                    amount,
                    roundingDecimal,
                    roundingDecimal
                );

                const text = side === '1' ? 'Borrow' : 'Lend';

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
                                        <h2 className='text-[0.9375rem] font-semibold'>
                                            {contract}
                                        </h2>
                                        <span
                                            className={clsx(
                                                'flex w-[45px] items-center justify-center rounded-full px-[0.375rem] py-[0.125rem] text-[0.625rem]',
                                                {
                                                    'bg-[#FFE5E8] text-[#FF324B]':
                                                        side === '1',
                                                    'bg-[#E4FFE7] text-[#10991D]':
                                                        side !== '1',
                                                }
                                            )}
                                        >
                                            {text}
                                        </span>
                                    </div>
                                </div>
                                <div className='flex flex-col items-end gap-1'>
                                    {!!status && (
                                        <span className='text-xs font-semibold'>
                                            {status}
                                        </span>
                                    )}
                                    {!!formattedLoanApr && (
                                        <p className='flex items-center gap-1 text-xs text-[#94A3B8]'>
                                            APR:{' '}
                                            <span className='text-sm font-semibold text-[#C4CAFF]'>
                                                {formattedLoanApr}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className='text-xs text-[#E2E8F0]'>
                                <ul className='flex w-full flex-col gap-[0.375rem]'>
                                    {!!formattedLoanValue && (
                                        <li className='flex justify-between'>
                                            <span>Market Price</span>
                                            <span>{formattedLoanValue}</span>
                                        </li>
                                    )}
                                    {!!contract && (
                                        <li className='flex justify-between'>
                                            <span>Contract</span>
                                            <span>{contract}</span>
                                        </li>
                                    )}
                                    {!!amountDisplay && (
                                        <li className='flex justify-between'>
                                            <span>Amount</span>
                                            <span>
                                                {amountDisplay} {ccy || ''}
                                            </span>
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
        </section>
    );
}
