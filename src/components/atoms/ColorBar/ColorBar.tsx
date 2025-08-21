import clsx from 'clsx';
import { ColorFormat } from 'src/types';
import { divide, multiply } from 'src/utils';
import { ZERO_BI, CollateralCalculator } from 'src/utils/collateral';

const COLORBAR_MIN_WIDTH = 5;
const COLORBAR_MAX_WIDTH = 308;
export const ColorBar = ({
    value,
    total,
    color,
    align,
}: {
    value: bigint;
    total: bigint;
    align: 'left' | 'right';
} & Required<ColorFormat>) => {
    const width = Math.min(
        Math.max(
            multiply(
                divide(
                    CollateralCalculator.calculatePercentage(value, total),
                    100
                ),
                COLORBAR_MAX_WIDTH
            ),
            COLORBAR_MIN_WIDTH
        ),
        COLORBAR_MAX_WIDTH
    );
    return (
        <div
            className={clsx('absolute h-6', {
                'bg-galacticOrange/20': color === 'negative',
                'bg-nebulaTeal/20': color === 'positive',
                '-left-0.5': align === 'left',
                '-right-0.5': align === 'right',
            })}
            data-testid='color-bar'
            style={{ width: value === ZERO_BI ? '2px' : `${width}%` }}
        ></div>
    );
};
