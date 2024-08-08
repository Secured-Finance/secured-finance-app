import clsx from 'clsx';

const StaticRateDisplay = ({ value }: { value: string }) => {
    return (
        <div className='flex flex-col items-end gap-1 laptop:flex-row laptop:items-center'>
            <span>{value}</span>
            <span>({value})</span>
        </div>
    );
};

export const PriceRateChange = ({
    percentageChange,
    aprChange,
}: {
    percentageChange: number | null;
    aprChange: number | null;
}) => {
    if (!percentageChange || !aprChange) {
        return <StaticRateDisplay value='-.--%' />;
    }

    let percentageChangeDisplay = '';
    let aprChangeDisplay = '';

    if (percentageChange > 0) {
        percentageChangeDisplay = `+${percentageChange.toFixed(2)}%`;
    }
    if (percentageChange < 0) {
        percentageChangeDisplay = `${percentageChange.toFixed(2)}%`;
    }

    if (aprChange > 0) {
        aprChangeDisplay = `+${aprChange.toFixed(2)}%`;
    }
    if (aprChange < 0) {
        aprChangeDisplay = `${aprChange.toFixed(2)}%`;
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
            <span
                className={clsx({
                    'text-success-300': aprChange > 0,
                    'text-error-300': aprChange < 0,
                })}
            >
                ({aprChangeDisplay} APR)
            </span>
        </div>
    );
};
