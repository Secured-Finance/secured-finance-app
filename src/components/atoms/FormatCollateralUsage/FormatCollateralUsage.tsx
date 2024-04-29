import { getLiquidationInformation } from 'src/components/atoms';
import { formatCollateralRatio } from 'src/utils';

export const FormatCollateralUsage = ({
    initialValue,
    finalValue,
    maxValue = Number.MAX_VALUE,
}: {
    initialValue: number;
    finalValue: number;
    maxValue?: number;
}) => {
    const initialColor = getLiquidationInformation(initialValue / 100).color;
    const finalColor = getLiquidationInformation(
        Math.min(finalValue, maxValue) / 100
    ).color;

    return (
        <div className='flex flex-row gap-1'>
            <span className={initialColor}>
                {formatCollateralRatio(initialValue)}
            </span>
            <span className='text-neutral-8'>&#8594;</span>
            <span className={finalColor}>
                {formatCollateralRatio(finalValue)}
            </span>
        </div>
    );
};
