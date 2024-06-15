import Share from '@heroicons/react/24/solid/ShareIcon';
import { useEffect, useState } from 'react';
import FilIcon from 'src/assets/coins/fil.svg';
import LockClose from 'src/assets/icons/lock-close.svg';
import LockOpen from 'src/assets/icons/lock-open.svg';
import { Tooltip } from 'src/components/molecules';
import { CountdownFormat, getCountdown } from 'src/utils';

const stages = [
    {
        text: 'Core Fueling',
        active: true,
    },
    {
        text: '',
        active: false,
    },
    {
        text: '',
        active: false,
    },
    {
        text: '',
        active: false,
    },
    {
        text: '',
        active: false,
    },
    {
        text: '',
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
        <div className='flex flex-row items-center justify-center gap-2 rounded-xl border-2 border-blue/75 bg-blue/25 px-2.5 py-1.5'>
            <LockOpen />
            <span className='typography-desktop-body-3 text-white'>{`Stage ${index}: ${text}`}</span>
        </div>
    ) : (
        <div className='flex flex-row items-center justify-center gap-2 px-3 opacity-50'>
            <LockClose />
            <span className='typography-desktop-body-3 text-white'>{`Stage ${index}`}</span>
        </div>
    );
};

export const StageBanner = () => {
    return (
        <div className='flex w-full flex-row items-center justify-between rounded-xl border-2 border-blue bg-blue/20 p-1.5'>
            {stages.map((stage, index) => {
                return (
                    <div key={index}>
                        <Stage
                            text={stage.text}
                            index={index + 1}
                            active={stage.active}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export const CampaignStatus = () => {
    return (
        <div className='flex h-[448px] w-[753px] flex-col justify-between rounded-3xl border-2 border-blue bg-[rgba(7,24,39,0.20)] p-8'>
            <div className='flex flex-col gap-10'>
                <div className='flex flex-col justify-between gap-14 laptop:flex-row laptop:items-center'>
                    <div className='flex flex-row items-center gap-4'>
                        <span className='h-3 w-3 rounded-full bg-warning-500 ring-[6px] ring-warning-300/10'></span>
                        <span className='laptop:typography-desktop-sh-7 typography-mobile-sh-8 uppercase text-white'>
                            Stage 1
                        </span>
                    </div>
                    <span className='text-4 uppercase leading-6 text-[#A7A7A7]'>
                        Jun 17, 12:00 AM (UTC) - Jun 28, 12:00 AM (UTC)
                    </span>
                </div>
                <div className='flex flex-row gap-6'>
                    <div className='flex w-[400px] flex-col gap-2 rounded-[14px] bg-white-5 p-6'>
                        <span className='text-4 leading-8 text-neutral-50'>
                            Campaign ends in...
                        </span>
                        <Timer targetTime={1719532800000}></Timer>
                    </div>
                    <div className='flex w-[264px] flex-col gap-2 rounded-[14px] bg-white-5 px-4 py-3'>
                        <span className='text-4 leading-8 text-neutral-50'>
                            Total Value Locked
                        </span>
                        <span className='text-7 leading-8 text-white'>
                            3,342,343 FIL
                        </span>
                        <span className='text-7 leading-8 text-white'>
                            1,234,567 iFIL
                        </span>
                        <span className='text-4 leading-8 text-white/40'>
                            ≈ $7,355.00
                        </span>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-6'>
                <span className='w-full text-4.5 leading-6 text-neutral-50'>
                    Quest Goal: Deposit following collateral assets and earn
                    double points
                </span>
                <div className='flex flex-row gap-4'>
                    <div className='flex w-fit flex-row items-center justify-center gap-2 rounded-2xl bg-chart-fil/20 px-8 py-2'>
                        <FilIcon className='h-18px w-18px' />
                        <span className='text-4.5 leading-7 text-white'>
                            FIL
                        </span>
                    </div>
                    <div className='flex w-fit flex-row items-center justify-center gap-2 rounded-2xl bg-[#6226FF]/20 px-8 py-2'>
                        <FilIcon className='h-18px w-18px' />
                        <span className='text-4.5 leading-7 text-white'>
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
    onShareClick,
}: {
    onDepositClick: () => void;
    onShareClick: () => void;
}) => {
    return (
        <div className='flex h-[448px] w-[750px] flex-col justify-between overflow-hidden rounded-3xl border-2 border-blue'>
            <div></div>
            <div className='flex flex-row justify-between bg-black-40 p-6'>
                <span className='w-80 text-8 font-semibold text-white'>
                    Earn double points by depositing FIL/iFIL
                </span>
                <div>
                    <div className='h-1/2'></div>
                    <div className='flex h-fit gap-3'>
                        <button
                            className='w-[168px] rounded-lg bg-blue px-5 py-2 text-4 font-semibold leading-6 text-white'
                            onClick={onDepositClick}
                        >
                            Deposit
                        </button>
                        <Tooltip
                            iconElement={
                                <button
                                    className='h-full rounded-lg border border-primary-300 bg-primary-300/60 p-3 text-white'
                                    onClick={onShareClick}
                                >
                                    <Share className='h-4 w-4' />
                                </button>
                            }
                        >
                            Share Invite
                        </Tooltip>
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
                {timeDesign(time.days, 'D')}
                <Separator />
                {timeDesign(time.hours, 'H')}
                <Separator />
                {timeDesign(time.minutes, 'M')}
                <Separator />
                {timeDesign(time.seconds, 'S')}
            </div>
        )
    );
};

const timeDesign = (val: string, text: string) => {
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
