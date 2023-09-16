import classNames from 'classnames';
import { BigNumber } from 'ethers';
import { ColorFormat } from 'src/types';
import { calculatePercentage } from 'src/utils/collateral';

const COLORBAR_MIN_WIDTH = 20;
const COLORBAR_MAX_WIDTH = 300;
const COLORBAR_MAGNIFIER = 1.5;
export const ColorBar = ({
    value,
    total,
    color,
    align,
}: {
    value: BigNumber;
    total: BigNumber;
    align: 'left' | 'right';
} & Required<ColorFormat>) => {
    const width = Math.min(
        Math.max(
            COLORBAR_MIN_WIDTH,
            Math.trunc(
                COLORBAR_MIN_WIDTH +
                    Math.pow(
                        calculatePercentage(value, total).toNumber(),
                        COLORBAR_MAGNIFIER
                    )
            )
        ),
        COLORBAR_MAX_WIDTH
    );
    return (
        <div
            className={classNames('absolute h-6', {
                'bg-galacticOrange/20': color === 'negative',
                'bg-nebulaTeal/20': color === 'positive',
                '-left-0.5': align === 'left',
                '-right-0.5': align === 'right',
            })}
            data-testid='color-bar'
            style={{ width: value.isZero() ? '2px' : `${width}%` }}
        ></div>
    );
};
