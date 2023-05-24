import { Counter } from 'src/components/atoms/Counter';

export interface PortfolioTabProps {
    name: string;
    value: string;
}

const getCounterValues = (value: string) => {
    value = value.replace(/,/g, '');
    const num = value.replace(/[^0-9.]/g, '');
    const prefixSuffixArray = value.split(num);
    return {
        prefix: prefixSuffixArray[0],
        suffix: prefixSuffixArray[1],
        value: parseFloat(num),
    };
};

export const PortfolioTab = ({ name, value }: PortfolioTabProps) => {
    const counterValues = getCounterValues(value);

    return (
        <div
            className='flex h-28 w-full flex-col items-center justify-center'
            role='gridcell'
        >
            <div className='flex h-full w-full flex-col items-center justify-center overflow-hidden'>
                <span className='typography-caption-2 h-5 w-full text-center text-secondary7'>
                    {name}
                </span>
                {counterValues.value !== 0 ? (
                    <Counter
                        value={counterValues.value}
                        prefix={counterValues.prefix}
                        suffix={counterValues.suffix}
                    />
                ) : (
                    <span
                        className='typography-body-1 h-8 w-full text-center text-white'
                        data-testid='portfolio-tab-value'
                    >
                        {value}
                    </span>
                )}
            </div>
        </div>
    );
};
