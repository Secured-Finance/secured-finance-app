/* eslint-disable prettier/prettier */
import { BuildingLibraryIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import Link from 'next/link';
import Badge from 'src/assets/icons/badge.svg';
import LockClose from 'src/assets/icons/lock-close.svg';
import LockOpen from 'src/assets/icons/lock-open.svg';
import Coins from 'src/assets/img/2d coins.svg';
import { CurrencyIcon } from 'src/components/atoms';
import { useBreakpoint, useGetCountdown } from 'src/hooks';
import { AmountConverter, CurrencySymbol, PriceFormatter } from 'src/utils';
import { stages } from './constants';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

export const Banner = ({ text }: { text: string }) => {
    return (
        <div className='laptop:typography-desktop-sh-8 desktop:typography-desktop-sh-7 w-fit rounded-3xl border border-tertiary-500 bg-tertiary-500/30 px-[18px] py-2 text-xs font-semibold uppercase leading-[18px] text-neutral-200 laptop:px-8'>
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
                <Stage text='Orbital Contracts' index={2} active />
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

const SFPoints = () => (
    <Link
        href='https://docs.secured.finance/top/secured-finance-points-sfp'
        target='_blank'
        className='relative top-1 inline-block tablet:top-0 tablet:ml-1 laptop:top-1 desktop:ml-0'
    >
        <span className='typography-mobile-body-5 tablet:typography-desktop-body-4 desktop:typography-desktop-body-3 flex items-center justify-center gap-1 rounded-lg bg-tertiary-500/20 py-1 pl-2 pr-3 font-semibold tablet:gap-1.5 tablet:rounded-xl tablet:py-2 tablet:pl-2.5 tablet:pr-3 laptop:ml-0 laptop:rounded-xl desktop:px-3 desktop:py-2'>
            <Badge className='h-[18px] w-[18px] tablet:h-3.5 tablet:w-3.5 laptop:h-4 laptop:w-4 desktop:h-[18px] desktop:w-[18px]' />{' '}
            <span className='underline'>SF Points</span>
        </span>
    </Link>
);

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
            AmountConverter.fromBase(valueLocked[ccy], ccy);
    });

    const campaignStartCopy = isStageOn
        ? 'Campaign ends in...'
        : 'Campaign starts in...';

    return (
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
                        Jun 29, 12:00 AM (UTC) - Dec 31, 12:00 AM (UTC)
                    </span>
                </div>
                <div className='flex flex-col gap-3 tablet:flex-row tablet:justify-between tablet:gap-5'>
                    <div className='flex flex-col gap-2 tablet:h-[152px] tablet:w-[48%] tablet:justify-center laptop:h-full laptop:w-[176px] laptop:justify-stretch desktop:w-[55%]'>
                        <span className='typography-mobile-body-5 flex text-neutral-300 tablet:hidden'>
                            {campaignStartCopy}
                        </span>
                        <div className='tablet:px-4.5 flex w-full flex-col gap-2 rounded-[14px] bg-white-5 px-4 py-2 tablet:h-full tablet:justify-center tablet:py-6'>
                            <span className='typography-mobile-body-4 hidden justify-center whitespace-nowrap text-neutral-50/80 tablet:flex laptop:justify-start'>
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
                        <div className='flex h-full w-full flex-col gap-2 rounded-[14px] bg-white-5 px-5 py-2 tablet:justify-center tablet:p-4 laptop:p-4'>
                            <span className='tablet:typography-desktop-body-4 hidden text-4 leading-8 text-neutral-50/80 tablet:mb-1 tablet:flex'>
                                Total Value Locked
                            </span>
                            {collateralCurrencies.map(ccy => {
                                return (
                                    <span
                                        className='typography-mobile-body-3 block text-center text-white tablet:text-left tablet:text-[22px] tablet:font-semibold desktop:text-7 desktop:leading-8'
                                        key={ccy}
                                    >
                                        {`${PriceFormatter.formatOrdinary(
                                            AmountConverter.fromBase(
                                                valueLocked[ccy],
                                                ccy
                                            ),
                                            FINANCIAL_CONSTANTS.ZERO_DECIMALS,
                                            FINANCIAL_CONSTANTS.ONE_DECIMAL
                                        )} ${ccy}`}
                                    </span>
                                );
                            })}
                            <span className='typography-mobile-body-4 laptop:typography-desktop-body-4 block text-center text-white/40 tablet:text-left desktop:text-4 desktop:leading-8'>
                                {`≈ ${PriceFormatter.formatUSDValue(
                                    totalUSDValue
                                )}`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-2 tablet:items-start laptop:gap-5 desktop:gap-6'>
                <span className='tablet:typography-desktop-body-5 laptop:typography-desktop-body-4 desktop:typography-desktop-body-3 typography-mobile-body-5 mb-1 inline-block w-full flex-wrap items-center text-neutral-50 tablet:inline-flex laptop:inline-block'>
                    Quest Goal: Place limit orders and keep active positions for
                    the following assets and earn <SFPoints />
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

export const DepositCard = () => {
    return (
        <div className='relative flex max-w-[752px] items-center overflow-hidden rounded-3xl border border-blue laptop:h-auto laptop:w-[50%] laptop:flex-col laptop:justify-between laptop:border-2 desktop:w-[46%] desktop:justify-end'>
            <div className='candlestick-bg-mobile laptop:candlestick-bg-alt desktop:candlestick-bg absolute left-0 top-0 h-full w-full bg-cover bg-right bg-no-repeat laptop:bg-center desktop:bg-cover'></div>
            <div className='absolute right-4 top-[5px] flex items-center justify-center laptop:inset-0'>
                {/* <Glow className='absolute hidden h-[300px] w-[420px] laptop:flex' /> */}
                <Coins className='z-2 relative h-[70px] w-auto laptop:-mt-[40px] laptop:h-[200px] laptop:w-[220px]' />
            </div>

            <span className='laptop:typography-desktop-body-1 relative hidden max-w-[50%] text-base font-semibold leading-6 text-white laptop:ml-6 laptop:mr-auto laptop:mt-6 laptop:block laptop:max-w-[200px] desktop:hidden desktop:text-[22px] desktop:leading-8'>
                Earn 2X{' '}
                <Link href='/points' className='underline'>
                    points
                </Link>{' '}
                by depositing FIL/iFIL
            </span>

            {/* eslint-disable-next-line prettier/prettier */}
            <div className='z-1 relative flex w-full flex-col justify-between gap-4 p-4 min-[645px]:gap-8 tablet:p-6 laptop:flex-row laptop:items-end desktop:items-center'>
                <span className='tablet:typography-mobile-body-1 block max-w-[50%] text-base font-semibold leading-6 text-white laptop:hidden laptop:max-w-[200px] laptop:text-[18px] laptop:leading-6 desktop:block desktop:text-[22px] desktop:leading-8'>
                    Earn 2X{' '}
                    <Link href='/points' className='underline'>
                        points
                    </Link>{' '}
                    by depositing FIL/iFIL
                </span>

                <Link href='/' className='laptop:w-full desktop:w-auto'>
                    <button className='border-primary-200 relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl border-2 bg-[linear-gradient(90deg,_#5162FF_0%,_#303B99_100%)] px-8 py-2.5 text-4 font-semibold leading-5 text-white hover:border-primary-500 hover:bg-[linear-gradient(90deg,_#303B99_0%,_#303B99_100%)] active:border-primary-700 laptop:w-full laptop:rounded-lg laptop:px-5 laptop:py-2.5 laptop:leading-5 desktop:w-[257px] min-[1920px]:w-[344px]'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='67'
                            height='44'
                            viewBox='0 0 67 44'
                            fill='none'
                            className='absolute right-1/2 -translate-x-[131%]'
                        >
                            <path
                                opacity='0.2'
                                d='M56 0L67 0L11 44H0L56 0Z'
                                fill='#1E293B'
                            />
                        </svg>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='269'
                            height='44'
                            viewBox='0 0 269 44'
                            fill='none'
                            className='absolute left-1/2 -translate-x-1/2'
                        >
                            <path
                                opacity='0.2'
                                d='M56 0L268.5 0L212.5 44H0L56 0Z'
                                fill='#1E293B'
                            />
                        </svg>
                        <BuildingLibraryIcon className='z-1 relative h-4 w-4 flex-shrink-0' />
                        <span className='z-1 relative'>Place Limit Order</span>
                    </button>
                </Link>
            </div>
        </div>
    );
};

const Timer = ({ targetTime }: { targetTime: number; text?: string }) => {
    const time = useGetCountdown(targetTime);

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
