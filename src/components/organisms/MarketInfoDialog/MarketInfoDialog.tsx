import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { formatDate } from '@secured-finance/sf-core';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useEffect, useState } from 'react';
import ArrowUpSquare from 'src/assets/icons/arrow-up-square.svg';
import DocumentTextIcon from 'src/assets/icons/document-text.svg';
import { Tooltip } from 'src/components/molecules';
import {
    CountdownFormat,
    currencyMap,
    CurrencySymbol,
    formatLoanValue,
    getCountdown,
    handlePriceSource,
} from 'src/utils';
import { MarketInfoDialogProps } from './types';

dayjs.extend(duration);

export const MarketInfoDialog = ({
    isOpen,
    onClose,
    currency,
    currentMarket,
    currencyPrice,
    marketInfo,
    lastLoanValue,
}: MarketInfoDialogProps) => {
    const maturity = currentMarket?.value.maturity ?? 0;
    const targetTime = maturity * 1000;
    const [time, setTime] = useState<CountdownFormat | undefined>(
        getCountdown(targetTime)
    );
    const lastPrice = formatLoanValue(currentMarket?.value, 'price');
    const CurrencyIcon = currencyMap[currency as CurrencySymbol]?.icon;

    const priceSource = handlePriceSource(currency as CurrencySymbol);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(getCountdown(targetTime));
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [targetTime]);

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
                            onClick={onClose}
                        >
                            <XMarkIcon className='h-4 w-4 text-neutral-50' />
                        </button>
                    </header>
                    <section className='typography-mobile-body-4 rounded-xl border border-neutral-600 px-5 py-3 text-neutral-300'>
                        <ul className='flex w-full flex-col gap-2'>
                            <li className='flex justify-between'>
                                <div className='flex items-center gap-1.5 pb-1'>
                                    <div className='p-[3px]'>
                                        <CurrencyIcon className='h-[22px] w-[22px]' />
                                    </div>
                                    <div className='flex flex-col'>
                                        <h3 className='font-semibold text-white'>
                                            {currency}
                                        </h3>
                                        <span className='typography-mobile-body-6'>
                                            {formatDate(maturity)}
                                        </span>
                                    </div>
                                </div>
                                <div className='flex flex-col items-end'>
                                    <span className='typography-body-2 font-semibold text-neutral-50'>
                                        {lastPrice}
                                    </span>
                                </div>
                            </li>
                            <li className='flex justify-between'>
                                <span>Last Price</span>
                                <div className='flex flex-col items-end'>
                                    <span>
                                        {formatLoanValue(
                                            lastLoanValue,
                                            'price'
                                        )}
                                    </span>
                                </div>
                            </li>
                            <li className='flex justify-between'>
                                <span>24h High</span>
                                <span>{marketInfo?.high}</span>
                            </li>
                            <li className='flex justify-between'>
                                <span>24h Low</span>
                                <span>{marketInfo?.low}</span>
                            </li>
                            <li className='flex justify-between'>
                                <span>24h Volume</span>
                                <Tooltip
                                    iconElement={
                                        <span>{marketInfo?.volume}</span>
                                    }
                                >
                                    <span>
                                        24h Vol: {marketInfo?.volumeInUSD}
                                    </span>
                                </Tooltip>
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
                                <span className='tabular-nums'>
                                    {`${time?.days}:${time?.hours}:${time?.minutes}:${time?.seconds}`}
                                </span>
                            </li>
                        </ul>
                    </section>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};
