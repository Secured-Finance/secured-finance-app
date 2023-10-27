import { useEffect, useState } from 'react';
import { countdown } from 'src/utils';

export const Timer = ({
    targetTime,
    text,
}: {
    targetTime: number;
    text?: string;
}) => {
    const [time, setTime] = useState<string>(countdown(targetTime));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(countdown(targetTime));
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [targetTime]);

    return (
        <div className='flex flex-row gap-1' data-chromatic='ignore'>
            {text && <p>{text}</p>}
            {time}
        </div>
    );
};
