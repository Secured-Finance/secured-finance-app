import { useEffect, useState } from 'react';
import { CountdownFormat, getCountdown } from 'src/utils';

export const useGetCountdown = (targetTime: number) => {
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

    return time;
};
