import clsx from 'clsx';

export const PriceRateChange = ({
    percentageChange,
    absChange,
}: {
    percentageChange: number | null;
    absChange: number | null;
}) => {
    if (!percentageChange || !absChange) {
        return (
            <div className='flex flex-col items-end gap-1 laptop:flex-row laptop:items-center'>
                <span>0.00</span>
                <span>(0.00%)</span>
            </div>
        );
    }

    const classNameRule = clsx({
        'text-success-300': absChange > 0,
        'text-error-300': absChange < 0,
    });

    let percentageChangeDisplay = '';
    let absChangeDisplay = '';

    if (percentageChange > 0) {
        percentageChangeDisplay = `+${percentageChange.toFixed(2)}%`;
    }
    if (percentageChange < 0) {
        percentageChangeDisplay = `${percentageChange.toFixed(2)}%`;
    }

    if (absChange > 0) {
        absChangeDisplay = `+${absChange.toFixed(2)}`;
    }

    if (percentageChange < 0) {
        percentageChangeDisplay = `${absChange.toFixed(2)}%`;
    }

    return (
        <div className='flex flex-col items-end gap-1 laptop:flex-row laptop:items-center'>
            <span className={classNameRule}>{absChangeDisplay}</span>
            <span className={classNameRule}>{percentageChangeDisplay}</span>
        </div>
    );
};
