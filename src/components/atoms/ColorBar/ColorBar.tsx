import classNames from 'classnames';
import { BigNumber } from 'ethers';
import { ColorFormat } from 'src/types';
import { calculatePercentage } from 'src/utils/collateral';

const COLORBAR_MIN_WIDTH = 3;
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
    const width = Math.max(
        COLORBAR_MIN_WIDTH,
        Math.trunc(calculatePercentage(value, total).toNumber() / 1.1)
    );
    return (
        <div
            className={classNames('absolute bottom-1 -z-10 h-4/6 opacity-20', {
                'bg-galacticOrange': color === 'negative',
                'bg-nebulaTeal': color === 'positive',
                'left-0.5': align === 'left',
                'right-0.5': align === 'right',
            })}
            data-testid='color-bar'
            style={{ width: `${width}%` }}
        ></div>
    );
};
