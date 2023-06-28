import CountUp from 'react-countup';

export const Counter = ({
    value,
    prefix,
    suffix,
}: {
    value: number;
    prefix: string;
    suffix: string;
}) => {
    return (
        <div className='typography-body-1 h-8 w-full text-center text-white'>
            <CountUp
                start={0}
                end={value}
                duration={2}
                decimals={Number.isInteger(value) ? 0 : 2}
                prefix={prefix}
                suffix={suffix}
                preserveValue={true}
                delay={0}
            />
        </div>
    );
};
