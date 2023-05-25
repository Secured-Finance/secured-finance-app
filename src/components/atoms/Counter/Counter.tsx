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
    let countUpAnim: CountUp;
    const countupRef = useRef(null);
    const prevValue = usePrevious(value);

    const initCountUp = () => {
        countUpAnim = new CountUp(countupRef.current ?? '', value, {
            decimalPlaces: Number.isInteger(value) ? 0 : 2,
            duration: 2,
            prefix: prefix,
            suffix: suffix,
            startVal: prevValue ?? 0,
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
    }, [value]);

    return (
        <span
            className='typography-body-1 h-8 w-full text-center text-white'
            ref={countupRef}
        ></span>
    );
};

const usePrevious = (value: number) => {
    const ref = useRef<number>();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
};
