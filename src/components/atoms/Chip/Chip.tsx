import clsx from 'clsx';
import { colorStyle, sizeStyle } from './constants';
import { ChipColors, ChipSizes } from './types';

export const Chip = ({
    color = ChipColors.Gray,
    size = ChipSizes.md,
    label,
    isFullWidth,
}: {
    color?: ChipColors;
    size?: ChipSizes;
    label: string;
    isFullWidth?: boolean;
}) => {
    return (
        <div
            className={clsx(
                'inline-flex items-center justify-center border py-0.5',
                { 'w-full': isFullWidth },
                colorStyle[color],
                sizeStyle[size]
            )}
        >
            {label}
        </div>
    );
};
