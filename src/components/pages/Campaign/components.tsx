import { BuildingLibraryIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import LockClose from 'src/assets/icons/lock-close.svg';
import LockOpen from 'src/assets/icons/lock-open.svg';
import Coins from 'src/assets/img/2d coins.svg';
import Glow from 'src/assets/img/glow.svg';
import { CurrencyIcon } from 'src/components/atoms';
import { useBreakpoint } from 'src/hooks';
import {
    CountdownFormat,
    CurrencySymbol,
    ZERO_BI,
    amountFormatterFromBase,
    getCountdown,
    ordinaryFormat,
    usdFormat,
} from 'src/utils';
import { stages } from './constants';

export const Banner = ({ text }: { text: string }) => {
    return (
        <div className='laptop:typography-desktop-sh-8 desktop:typography-desktop-sh-7 w-fit rounded-3xl border border-primary-500 bg-primary-700 px-[18px] py-2 text-xs font-semibold uppercase leading-[18px] text-neutral-200 laptop:px-8'>
            {text}
        </div>
    );
};

export const Stage = ({
    text,
    index,
    active,
}: {
    text: string;
    index: number;
    active: boolean;
}) => {
    return active ? (
        <div className='flex w-full flex-row items-center gap-2 rounded-xl border border-blue/75 bg-blue/25 px-2.5 py-1.5 tablet:px-3 laptop:justify-center laptop:border-2'>
            <LockOpen className='h-3 w-3 laptop:h-3.5 laptop:w-3.5' />
            <span className='tablet:typography-desktop-body-5 typography-mobile-body-4 laptop:typography-desktop-body-4 desktop:typography-desktop-body-3 text-white'>{`Stage ${index}: ${text}`}</span>
        </div>
    ) : (
        <div className='flex flex-row items-center justify-center gap-2 px-3 opacity-50 laptop:min-w-[100px] desktop:min-w-[153px]'>
            <LockClose className='h-3 w-3 laptop:h-3.5 laptop:w-3.5' />
            <span className='desktop:typography-desktop-body-3 tablet:typography-desktop-body-5  laptop:typography-desktop-body-4 text-white'>{`Stage ${index}`}</span>
        </div>
    );
};

export const StageBanner = () => {
    const isMobile = useBreakpoint('tablet');
    return (
        <div className='flex w-full flex-row items-center gap-2 rounded-xl border-2 border-blue bg-blue/20 px-2 py-1.5 backdrop-blur-sm tablet:w-auto tablet:justify-between laptop:w-fit desktop:gap-3 desktop:rounded-[20px]'>
            {!isMobile ? (
                stages.map((stage, index) => {
                    return (
                        <div key={index}>
                            <Stage
                                key={index}
                                text={stage.text}
                                index={index + 1}
                                active={stage.active}
                            />
                        </div>
                    );
                })
            ) : (
                <Stage text='Core Fueling' index={1} active />
            )}
        </div>
    );
};

export const MultiplierBlock = () => {
    return (
        <span className='absolute right-0 top-0 flex h-[19px] w-11 items-center justify-center rounded-bl-2xl bg-[linear-gradient(124deg,_#F7BD26_11.69%,_#BB8700_110.74%)] text-2xs font-semibold text-neutral-800 tablet:w-[29px] tablet:text-white'>
            2x
        </span>
    );
};

export const CampaignStatus = ({
    startTime,
    endTime,
    collateralCurrencies,
    valueLocked,
    priceList,
}: {
    startTime: number;
    endTime: number;
    collateralCurrencies: CurrencySymbol[];
    valueLocked: Partial<Record<CurrencySymbol, bigint>>;
    priceList: Record<CurrencySymbol, number>;
}) => {
    const isStageOn = Date.now() - startTime > 0;
    let totalUSDValue = 0;
    collateralCurrencies.forEach(ccy => {
        totalUSDValue +=
            (priceList[ccy] ?? 0) *
            amountFormatterFromBase[ccy](valueLocked[ccy] ?? ZERO_BI);
    });

    const campaignStartCopy = isStageOn
        ? 'Campaign ends in...'
        : 'Campaign starts in...';

    return (
        // eslint-disable-next-line prettier/prettier
        <div className='flex max-w-[753px] flex-col justify-between gap-3 rounded-3xl border border-blue bg-[rgba(7,24,39,0.20)] p-4 backdrop-blur-[20px] tablet:p-6 laptop:w-[48%] laptop:gap-[30px] laptop:border-2 laptop:p-6 desktop:w-[54%] desktop:p-8'>
            <div className='flex flex-col gap-3 desktop:gap-7'>
                <div className='flex flex-col justify-between gap-2 desktop:flex-row desktop:items-center'>
                    <div className='flex flex-row items-center gap-4'>
                        <span
                            className={clsx('h-3 w-3 rounded-full ring-8', {
                                'bg-[#6EC94E] ring-[#84D069]/10': isStageOn,
                                'bg-warning-500 ring-warning-300/10':
                                    !isStageOn,
                            })}
                        ></span>
                        <span className='typography-mobile-sh-8 tablet:typography-desktop-sh-9 uppercase text-white'>
                            Status: {isStageOn ? 'Active' : 'Not started'}
                        </span>
                    </div>
                    <span className='typography-mobile-body-5 tablet:typography-desktop-body-4 text-neutral-300 desktop:text-base desktop:leading-6'>
                        Jun 19, 12:00 AM (UTC) - Jun 28, 12:00 AM (UTC)
                    </span>
                </div>
                <div className='flex flex-col gap-3 tablet:flex-row tablet:justify-between tablet:gap-5'>
                    <div className='flex flex-col gap-2 tablet:h-full tablet:w-[48%] tablet:justify-center laptop:w-[176px] desktop:w-[55%]'>
                        <span className='typography-mobile-body-5 flex text-neutral-300 tablet:hidden'>
                            {campaignStartCopy}
                        </span>
                        <div className='flex w-full flex-col gap-2 rounded-[14px] bg-white-5 px-4 py-2 tablet:h-[152px] tablet:justify-center tablet:p-6 laptop:h-auto desktop:h-full'>
                            <span className='typography-mobile-body-4 hidden justify-center text-neutral-50/80 tablet:flex laptop:justify-start'>
                                {campaignStartCopy}
                            </span>
                            <Timer
                                targetTime={isStageOn ? endTime : startTime}
                            />
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 tablet:w-[48%] laptop:w-[61%] desktop:w-[45%]'>
                        <span className='typography-mobile-body-5 flex text-neutral-300 tablet:hidden'>
                            Total Value Locked
                        </span>
                        <div className='flex w-full flex-col gap-2 rounded-[14px] bg-white-5 px-5 py-2 tablet:justify-center tablet:p-4 laptop:h-[166px] laptop:p-4'>
                            <span className='tablet:typography-desktop-body-4 hidden text-4 leading-8 text-neutral-50/80 tablet:mb-1 tablet:flex'>
                                Total Value Locked
                            </span>
                            {collateralCurrencies.map(ccy => {
                                return (
                                    <span
                                        className='typography-mobile-body-3 block text-center text-white tablet:text-left tablet:text-[22px] tablet:font-semibold desktop:text-7 desktop:leading-8'
                                        key={ccy}
                                    >
                                        {`${ordinaryFormat(
                                            amountFormatterFromBase[ccy](
                                                valueLocked[ccy] ?? ZERO_BI
                                            ),
                                            0,
                                            1
                                        )} ${ccy}`}
                                    </span>
                                );
                            })}
                            <span className='typography-mobile-body-4 laptop:typography-desktop-body-4 block text-center text-white/40 tablet:text-left desktop:text-4 desktop:leading-8'>
                                {`≈ ${usdFormat(totalUSDValue, 2)}`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-2 tablet:items-start laptop:gap-5 desktop:gap-6'>
                <span className='laptop:typography-desktop-body-4 desktop:typography-desktop-body-3 typography-mobile-body-5 w-full text-neutral-50'>
                    Quest Goal: Deposit following collateral assets and earn
                    double points
                </span>
                <div className='flex flex-row items-center gap-3 laptop:gap-4'>
                    <div className='relative flex w-1/2 flex-row items-center justify-center gap-2 overflow-hidden rounded-2xl bg-chart-fil/20 px-8 py-2 laptop:w-fit'>
                        <MultiplierBlock />
                        <CurrencyIcon
                            ccy={collateralCurrencies[0]}
                            variant='campaign'
                        />
                        <span className='text-4 leading-6 text-white laptop:text-4.5 laptop:leading-7'>
                            {collateralCurrencies[0]}
                        </span>
                    </div>

                    <div className='relative flex w-1/2 flex-row items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#6226FF]/20 px-8 py-2 laptop:w-fit'>
                        <MultiplierBlock />
                        <CurrencyIcon
                            ccy={collateralCurrencies[1]}
                            variant='campaign'
                        />
                        <span className='text-4 leading-6 text-white laptop:text-4.5 laptop:leading-7'>
                            {collateralCurrencies[1]}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const DepositCard = ({
    onDepositClick,
}: {
    onDepositClick: () => void;
}) => {
    return (
        <div className='relative flex max-w-[752px] items-end overflow-hidden rounded-3xl border border-blue laptop:h-auto laptop:w-[50%] laptop:border-2 desktop:w-[46%]'>
            <div className='wormhole absolute left-0 top-0 h-full w-full bg-[rgb(39,52,119)] bg-cover bg-center'></div>
            <div className='absolute right-4 top-[5px] flex items-center justify-center laptop:inset-0'>
                <Glow className='absolute hidden h-[300px] w-[420px] laptop:flex' />
                <Coins className='z-2 relative h-[70px] w-auto laptop:-mt-[40px] laptop:h-[200px] laptop:w-[220px]' />
            </div>

            {/* eslint-disable-next-line prettier/prettier */}
            <div className='z-1 relative flex w-full flex-col justify-between gap-4 p-4 min-[645px]:gap-8 tablet:p-6 laptop:flex-row laptop:items-end'>
                <span className='tablet:typography-mobile-body-1 block max-w-[50%] text-base font-semibold leading-6 text-white laptop:max-w-[200px] laptop:text-[18px] laptop:leading-6 desktop:text-[22px] desktop:leading-8'>
                    Earn 2X points by depositing FIL/iFIL
                </span>

                <button
                    className='flex w-full items-center justify-center gap-2.5 rounded-2xl bg-primary-500 px-8 py-3 text-4 font-semibold leading-5 text-white hover:bg-primary-700 laptop:w-[142px] laptop:rounded-lg laptop:px-5 laptop:py-3 laptop:leading-5 desktop:w-[257px]'
                    onClick={onDepositClick}
                >
                    <BuildingLibraryIcon className='h-4 w-4 flex-shrink-0' />
                    Deposit
                </button>
            </div>
        </div>
    );
};

const Timer = ({ targetTime }: { targetTime: number; text?: string }) => {
    const [time, setTime] = useState<CountdownFormat | undefined>(
        getCountdown(targetTime)
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(getCountdown(targetTime));
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [targetTime]);

    return (
        time && (
            <div
                className='grid grid-cols-12 items-center justify-between'
                data-chromatic='ignore'
            >
                {TimeDesign(time.days, 'D')}
                {TimeDesign(time.hours, 'H')}
                {TimeDesign(time.minutes, 'M')}
                {TimeDesign(time.seconds, 'S', true)}
            </div>
        )
    );
};

const TimeDesign = (val: string, text: string, isLast?: boolean) => {
    return (
        <div
            className={clsx(
                'col-span-3 flex justify-center gap-[7px] laptop:col-span-6 desktop:col-span-3',
                {
                    'border-r border-neutral-600 laptop:border-r-0': !isLast,
                }
            )}
        >
            <span className='font-numerical text-[22px] font-medium leading-8 tracking-[1.368px] text-neutral-50 tablet:text-6 desktop:text-9'>
                {val}
            </span>
            <span className='flex items-center'>
                <span className='typography-mobile-body-5 text-neutral-100/50 desktop:mt-2.5'>
                    {text}
                </span>
            </span>
        </div>
    );
};
