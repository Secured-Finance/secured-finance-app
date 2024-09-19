import { useEffect, useState } from 'react';
import { MarketTab } from 'src/components/atoms';
import { CountdownFormat, getCountdown } from 'src/utils';

export const CountdownTimer = ({ maturity }: { maturity: number }) => {
    const targetTime = maturity * 1000;
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
        <MarketTab
            name='Countdown'
            value={
                <span className='tabular-nums'>{`${time?.days}:${time?.hours}:${time?.minutes}:${time?.seconds}`}</span>
            }
        />
    );
};
