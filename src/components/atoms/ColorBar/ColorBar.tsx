import classNames from 'classnames';
import { BigNumber } from 'ethers';
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
    color: 'red' | 'green';
    align: 'left' | 'right';
}) => {
    const width = Math.max(
        COLORBAR_MIN_WIDTH,
        Math.trunc(calculatePercentage(value, total).toNumber() / 1.1)
    );
    return (
        <div
            className={classNames('absolute bottom-1 -z-10 h-4/6 opacity-20', {
                'bg-galacticOrange': color === 'red',
                'bg-nebulaTeal': color === 'green',
                'left-3': align === 'left',
                'right-3': align === 'right',
            })}
            data-testid='color-bar'
            style={{ width: `${width}%` }}
        ></div>
    );
};
