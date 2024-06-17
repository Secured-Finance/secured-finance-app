import { useEffect, useState } from 'react';
import FilIcon from 'src/assets/coins/fil.svg';
import IFilIcon from 'src/assets/coins/ifil.svg';
import LockClose from 'src/assets/icons/lock-close.svg';
import LockOpen from 'src/assets/icons/lock-open.svg';
import WormholeDesktop from 'src/assets/img/wormhole-desktop.svg';
// import WormholeMobile from 'src/assets/img/wormhole-mobile.svg';
import { useBreakpoint } from 'src/hooks';
import {
    CountdownFormat,
    CurrencySymbol,
    ZERO_BI,
    amountFormatterFromBase,
    getCountdown,
    usdFormat,
} from 'src/utils';

const stages = [
    {
        text: 'Core Fueling',
        active: true,
    },
    {
        text: 'Orbital Contracts',
        active: false,
    },
    {
        text: 'Stellar Minting',
        active: false,
    },
];

export const Banner = ({ text }: { text: string }) => {
    return (
        <div className='w-fit rounded-3xl border border-primary-500 bg-primary-500/50 px-[18px] py-2 text-3.5 font-semibold uppercase leading-[18px] text-neutral-100 laptop:px-8 laptop:text-7 laptop:leading-9 laptop:tracking-[3.311px]'>
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
        <div className='flex w-full flex-row items-center gap-2 rounded-xl border border-blue/75 bg-blue/25 px-2.5 py-1.5 laptop:justify-center laptop:border-2'>
            <LockOpen />
            <span className='laptop:typography-desktop-body-3 typography-mobile-body-4 text-white'>{`Stage ${index}: ${text}`}</span>
        </div>
    ) : (
        <div className='flex flex-row items-center justify-center gap-2 px-3 opacity-50'>
            <LockClose />
            <span className='typography-desktop-body-3 text-white'>{`Stage ${index}`}</span>
        </div>
    );
};

export const StageBanner = () => {
    const isTablet = useBreakpoint('laptop');
    return (
        <div className='flex w-fit flex-row items-center gap-14 rounded-[20px] border-2 border-blue bg-blue/20 p-1.5 backdrop-blur-sm laptop:rounded-xl'>
            {!isTablet ? (
                stages.map((stage, index) => {
                    return (
                        <div key={index}>
                            <Stage
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

export const CampaignStatus = ({
    startTime,
    endTime,
    stage,
    collateralCurrencies,
    collateral,
    priceList,
}: {
    startTime: number;
    endTime: number;
    stage: string;
    collateralCurrencies: CurrencySymbol[];
    collateral: Partial<Record<CurrencySymbol, bigint>>;
    priceList: Record<CurrencySymbol, number>;
}) => {
    const isStageOn = Date.now() - startTime > 0;
    let totalUSDValue = 0;
    collateralCurrencies.forEach(ccy => {
        totalUSDValue +=
            priceList[ccy] *
            amountFormatterFromBase[ccy](collateral[ccy] ?? ZERO_BI);
    });

    return (
        <div className='flex flex-col justify-between gap-3 rounded-3xl border-2 border-blue bg-[rgba(7,24,39,0.20)] p-4 backdrop-blur-[20px] laptop:p-8'>
            <div className='flex flex-col gap-10'>
                <div className='flex flex-col justify-between laptop:flex-row laptop:items-center'>
                    <div className='flex flex-row items-center gap-4'>
                        <span className='h-3 w-3 rounded-full bg-[#6EC94E] ring-[6px] ring-[#84D069]/10'></span>
                        <span className='laptop:typography-desktop-sh-7 typography-mobile-sh-8 uppercase text-white'>
                            {stage}
                        </span>
                    </div>
                    <span className='text-4 uppercase leading-6 text-[#A7A7A7]'>
                        Jun 19, 12:00 AM (UTC) - Jun 28, 12:00 AM (UTC)
                    </span>
                </div>
                <div className='flex flex-col gap-6 laptop:flex-row'>
                    <div className='flex w-full flex-col gap-2 rounded-[14px] bg-white-5 p-6 laptop:w-[400px]'>
                        <span className='text-4 leading-8 text-neutral-50'>
                            {isStageOn
                                ? 'Campaign ends in...'
                                : 'Campaign starts in...'}
                        </span>
                        <Timer
                            targetTime={isStageOn ? endTime : startTime}
                        ></Timer>
                    </div>
                    <div className='flex w-full flex-col gap-2 rounded-[14px] bg-white-5 px-4 py-3 laptop:w-[264px]'>
                        <span className='text-4 leading-8 text-neutral-50'>
                            Total Value Locked
                        </span>
                        {collateralCurrencies.map(ccy => {
                            return (
                                <span
                                    className='text-7 leading-8 text-white'
                                    key={ccy}
                                >
                                    {`${amountFormatterFromBase[ccy](
                                        collateral[ccy] ?? ZERO_BI
                                    )} ${ccy}`}
                                </span>
                            );
                        })}
                        <span className='text-4 leading-8 text-white/40'>
                            {`≈ ${usdFormat(totalUSDValue, 2)}`}
                        </span>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-3 laptop:gap-6'>
                <span className='w-full text-3.5 leading-[22px] text-neutral-50 laptop:text-4.5 laptop:leading-6'>
                    Quest Goal: Deposit following collateral assets and earn
                    double points
                </span>
                <div className='flex flex-row gap-3 laptop:gap-4'>
                    <div className='flex w-1/2 flex-row items-center justify-center gap-2 rounded-2xl bg-chart-fil/20 px-8 py-3 laptop:w-fit laptop:py-2'>
                        <FilIcon className='h-18px w-18px' />
                        <span className='text-4 leading-6 text-white laptop:text-4.5 laptop:leading-7'>
                            FIL
                        </span>
                    </div>
                    <div className='flex w-1/2 flex-row items-center justify-center gap-2 rounded-2xl bg-[#6226FF]/20 px-8 py-3 laptop:w-fit laptop:py-2'>
                        <IFilIcon className='h-18px w-18px' />
                        <span className='text-4 leading-6 text-white laptop:text-4.5 laptop:leading-7'>
                            iFIL
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
        <div className='relative h-[448px] overflow-hidden rounded-3xl border-2 border-blue laptop:w-[750px]'>
            <WormholeDesktop className='absolute h-full w-full' />
            <div className='absolute flex h-full w-full flex-col justify-between overflow-hidden'>
                <div></div>
                <div className='flex flex-col justify-between gap-4 p-4 laptop:flex-row laptop:p-6'>
                    <span className='w-52 text-6 font-semibold leading-8 text-white laptop:w-80 laptop:text-8 laptop:leading-10'>
                        Earn 2X points by depositing FIL/iFIL
                    </span>
                    <div>
                        <div className='hidden h-1/2 laptop:block'></div>
                        <button
                            className='w-full rounded-2xl bg-primary-500 px-8 py-3 text-4 font-semibold leading-5 text-white hover:bg-primary-700 laptop:h-1/2 laptop:w-[168px] laptop:rounded-lg laptop:px-5 laptop:py-2 laptop:leading-6'
                            onClick={onDepositClick}
                        >
                            Deposit
                        </button>
                    </div>
                </div>
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
                className='flex flex-row items-center justify-between'
                data-chromatic='ignore'
            >
                {TimeDesign(time.days, 'D')}
                <Separator />
                {TimeDesign(time.hours, 'H')}
                <Separator />
                {TimeDesign(time.minutes, 'M')}
                <Separator />
                {TimeDesign(time.seconds, 'S')}
            </div>
        )
    );
};

const TimeDesign = (val: string, text: string) => {
    return (
        <div className='flex gap-2'>
            <span className='font-tertiary text-[42px] font-medium leading-14 text-neutral-50'>
                {val}
            </span>
            <span className='flex items-end'>
                <span className='pb-2.5 align-top text-4 leading-4 text-neutral-100/50'>
                    {text}
                </span>
            </span>
        </div>
    );
};

const Separator = () => {
    return <div className='h-9 w-1px bg-white-40'></div>;
};
