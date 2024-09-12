import clsx from 'clsx';

const StaticRateDisplay = ({ value }: { value: string }) => {
    return (
        <div className='flex flex-col items-end gap-1 laptop:flex-row laptop:items-center'>
            <span>{value}</span>
        </div>
    );
};

export const PriceRateChange = ({
    percentageChange,
}: {
    percentageChange: number | null;
}) => {
    if (!percentageChange) {
        return <StaticRateDisplay value='--.--%' />;
    }

    let percentageChangeDisplay = '';

    if (percentageChange > 0) {
        percentageChangeDisplay = `+${percentageChange.toFixed(2)}%`;
    }
    if (percentageChange < 0) {
        percentageChangeDisplay = `${percentageChange.toFixed(2)}%`;
    }

    return (
        <div className='flex flex-col items-end gap-1 laptop:flex-row laptop:items-center'>
            <span
                className={clsx({
                    'text-success-300': percentageChange > 0,
                    'text-error-300': percentageChange < 0,
                })}
            >
                {percentageChangeDisplay}
            </span>
        </div>
    );
};
