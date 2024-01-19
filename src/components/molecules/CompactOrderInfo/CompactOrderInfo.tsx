import { getUTCMonthYear } from '@secured-finance/sf-core';
import classNames from 'classnames';
import { useMemo } from 'react';
import { CurrencyIcon } from 'src/components/atoms';
import { Order } from 'src/hooks';
// import { Order } from 'src/types';
import {
    CurrencySymbol,
    currencyMap,
    formatLoanValue,
    hexToCurrencySymbol,
} from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';

// TODO: replacr with Order
type Props = { data?: any };

export type OpenOrder = Order & { calculationDate?: number };

export default function CompactOrderInfo({ data }: Props) {
    // TODO: handle edge cases for converting to contract name!
    const order = data[0];

    const unitPrice = order.unitPrice;
    const ccy = hexToCurrencySymbol(order.currency);

    const contract = useMemo(() => {
        const maturity = new Maturity(order.maturity);
        return `${ccy}-${getUTCMonthYear(maturity.toNumber())}`;
    }, [ccy, order]);

    // loan value
    const calculationDate = order.calculationDate;
    const loanValue = LoanValue.fromPrice(
        Number(unitPrice.toString()),
        Number(order.maturity.toString()),
        calculationDate
    );

    const formattedLoanValue = formatLoanValue(loanValue, 'price');
    const formattedLoanApr = formatLoanValue(loanValue, 'rate');
    // PriceYieldItem

    const amount = currencyMap[ccy as CurrencySymbol].fromBaseUnit(
        order.amount as bigint
    );

    console.log('CompactOrderInfo data', order, { formattedLoanApr });

    const Side = () => {
        const text = order.side === '1' ? 'Borrow' : 'Lend';

        return (
            <span
                className={classNames(
                    'flex w-[45px] items-center justify-center rounded-full px-[0.375rem] py-[0.125rem] text-[0.625rem]',
                    {
                        'bg-[#FFE5E8] text-[#FF324B]': order.side === '1',
                        'bg-[#E4FFE7] text-[#10991D]': order.side !== '1',
                    }
                )}
            >
                {text}
            </span>
        );
    };

    return (
        <div className='px-5'>
            <div className='flex flex-col gap-4 border-b border-neutral-600 py-4 text-[#FBFAFC]'>
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
                            <Side />
                        </div>
                    </div>
                    <button className='max-h-7 overflow-hidden rounded-md border border-[#C4CAFF] px-[0.625rem] py-1 text-xs font-semibold leading-none text-[#C4CAFF]'>
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
}
