import { useEffect, useState } from 'react';
import { CountdownFormat, getCountdown } from 'src/utils';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

export const useGetCountdown = (targetTime: number) => {
    const [time, setTime] = useState<CountdownFormat | undefined>(
        getCountdown(targetTime)
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(getCountdown(targetTime));
        }, FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD);

        return () => {
            clearInterval(interval);
        };
    }, [targetTime]);

    return (
        time ?? {
            days: '00',
            hours: '00',
            minutes: '00',
            seconds: '00',
        }
    );
};
