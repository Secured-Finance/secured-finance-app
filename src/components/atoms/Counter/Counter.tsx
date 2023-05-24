import { CountUp } from 'countup.js';
import { useEffect, useRef } from 'react';

export const Counter = ({
    value,
    prefix,
    suffix,
}: {
    value: number;
    prefix: string;
    suffix: string;
}) => {
    const countupRef = useRef(null);
    let countUpAnim: CountUp;
    const decimalPlaces = Number.isInteger(value)
        ? 0
        : value.toString().split('.')[1].length;

    const initCountUp = () => {
        countUpAnim = new CountUp(countupRef.current ?? '', value, {
            decimalPlaces: decimalPlaces,
            duration: 2,
            prefix: prefix,
            suffix: suffix,
        });
        if (!countUpAnim.error) {
            countUpAnim.start();
        } else {
            console.error(countUpAnim.error);
        }
    };

    useEffect(() => {
        initCountUp();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className='typography-body-1 h-8 w-full text-center text-white'
            ref={countupRef}
        ></div>
    );
};
