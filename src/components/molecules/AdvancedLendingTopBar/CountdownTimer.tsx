import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { MarketTab } from 'src/components/atoms';

import { formatRemainingTime } from 'src/utils';

export const CountdownTimer = ({ maturity }: { maturity: number }) => {
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
        <MarketTab
            name='Countdown'
            value={
                <span className='tabular-nums'>
                    {formatRemainingTime(remainingTime)}
                </span>
            }
        />
    );
};
