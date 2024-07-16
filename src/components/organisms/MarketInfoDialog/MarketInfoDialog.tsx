import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { cloneElement, useEffect, useState } from 'react';
import ArrowUpSquare from 'src/assets/icons/arrow-up-square.svg';
import DocumentTextIcon from 'src/assets/icons/document-text.svg';
import { CurrentMarket } from 'src/types';
import {
    CurrencySymbol,
    formatLoanValue,
    formatRemainingTime,
} from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import { mapCurrencyToIcon } from './constants';

dayjs.extend(duration);

export interface MarketInfoDialogProps {
    isOpen: boolean;
    onClose: () => void;
    currency?: CurrencySymbol;
    currentMarket?: CurrentMarket;
    currencyPrice: string;
    priceSource?: string;
    dailyStats?: {
        high: string;
        low: string;
        volume: string;
        rateHigh: string;
        rateLow: string;
        isIncreased?: boolean;
    };
    lastLoanValue?: LoanValue;
}

export const MarketInfoDialog = ({
    isOpen,
    onClose,
    currency,
    currentMarket,
    currencyPrice,
    priceSource,
    dailyStats,
    lastLoanValue,
}: MarketInfoDialogProps) => {
    const lastPrice = formatLoanValue(currentMarket?.value, 'price');
    const rate = formatLoanValue(currentMarket?.value, 'rate');
    const maturity = currentMarket?.value.maturity ?? 0;
    const currencyIcon = mapCurrencyToIcon(currency as CurrencySymbol);
    const [remainingTime, setRemainingTime] = useState<number>(
        maturity - dayjs().unix()
    );

    useEffect(() => {
        const updateCountdown = () => {
            const now = dayjs().unix();
            const timeLeft = maturity - now;

            if (timeLeft <= 0) {
                setRemainingTime(0);
                clearInterval(interval);
                return;
            }

            setRemainingTime(timeLeft);
        };

        const interval = setInterval(updateCountdown, 1000);
        updateCountdown();

        return () => clearInterval(interval);
    }, [maturity]);

    return (
        <Dialog open={isOpen} onClose={onClose} className='relative z-[31]'>
            <div className='fixed inset-0 bg-backgroundBlur backdrop-blur-sm' />
            <div className='fixed inset-0 flex items-center justify-center'>
                <Dialog.Panel className='flex w-[79%] min-w-[295px] flex-col gap-3 rounded-xl border border-neutral-600 bg-neutral-900 p-5'>
                    <header className='flex justify-between'>
                        <h2 className='typography-mobile-h-6 flex items-center gap-1 text-neutral-50'>
                            <DocumentTextIcon className='h-5 w-5' />
                            Details
                        </h2>
                        <button
                            className='flex h-8 w-8 items-center justify-center rounded-full border border-neutral-600'
                            onClick={() => onClose()}
                        >
                            <XMarkIcon className='h-4 w-4 text-neutral-50' />
                        </button>
                    </header>
                    <section className='typography-mobile-body-4 rounded-xl border border-neutral-600 px-5 py-3 text-neutral-300'>
                        <ul className='flex w-full flex-col gap-2'>
                            <li className='flex justify-between'>
                                <div className='flex items-center gap-1.5 pb-1'>
                                    <div className='p-[3px]'>
                                        {currencyIcon &&
                                            cloneElement(currencyIcon, {
                                                className: 'h-[22px] w-[22px]',
                                            })}
                                    </div>
                                    <div className='flex flex-col'>
                                        <h3 className='font-semibold text-white'>
                                            {currency}
                                        </h3>
                                        <span className='typography-mobile-body-6'>
                                            21:00:59 (GMT+7)
                                        </span>
                                    </div>
                                </div>
                                <div className='flex flex-col items-end'>
                                    <span className='typography-body-2 font-semibold text-neutral-50'>
                                        {lastPrice}
                                    </span>
                                    <span className='typography-mobile-body-5 text-white'>
                                        {rate} APR
                                    </span>
                                </div>
                            </li>
                            <li className='flex justify-between'>
                                <span>Last Price (APR)</span>
                                <div className='flex flex-col items-end'>
                                    <span>
                                        {formatLoanValue(
                                            lastLoanValue,
                                            'price'
                                        )}
                                    </span>
                                    <span>
                                        {formatLoanValue(lastLoanValue, 'rate')}
                                    </span>
                                </div>
                            </li>
                            <li className='flex justify-between'>
                                <span>24H Change</span>
                                <div className='flex flex-col items-end'>
                                    <span>+9.68%</span>
                                    <span>(-10.00% APR)</span>
                                </div>
                            </li>
                            <li className='flex justify-between'>
                                <span>24H High</span>
                                <span>{dailyStats?.high}</span>
                            </li>
                            <li className='flex justify-between'>
                                <span>24H Low</span>
                                <span>{dailyStats?.low}</span>
                            </li>
                            <li className='flex justify-between'>
                                <span>24H Volume</span>
                                <span>{dailyStats?.volume}</span>
                            </li>
                            <li className='flex justify-between'>
                                <span>{currency} Price</span>
                                <span className='flex items-center gap-1'>
                                    {currencyPrice}
                                    {priceSource && (
                                        <a
                                            href={priceSource}
                                            className='flex h-full w-full cursor-pointer items-center'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                        >
                                            <ArrowUpSquare className='h-[15px] w-[15px]' />
                                        </a>
                                    )}
                                </span>
                            </li>
                            <li className='flex justify-between'>
                                <span>Countdown</span>
                                <span>
                                    {formatRemainingTime(remainingTime)}
                                </span>
                            </li>
                        </ul>
                    </section>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};
