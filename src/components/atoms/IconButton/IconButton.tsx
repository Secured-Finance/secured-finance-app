import clsx from 'clsx';
import { ButtonSizes, SvgIcon } from 'src/types';
import { iconSizeStyle, sizeStyle, variantStyle } from './constants';
import { IconButtonVariants } from './types';

export const IconButton = ({
    onClick,
    Icon,
    variant = IconButtonVariants.primary,
    size = ButtonSizes.sm,
}: {
    onClick: () => void;
    Icon: SvgIcon;
    variant?: IconButtonVariants;
    size?: ButtonSizes;
}) => {
    return (
        <button
            className={clsx(
                'flex aspect-square items-center justify-center rounded-full border disabled:border-transparent disabled:bg-neutral-600 disabled:text-neutral-400',
                'light:disabled:border-neutral-200 light:disabled:bg-neutral-100 light:disabled:text-neutral-400',
                variantStyle[variant],
                sizeStyle[size]
            )}
            onClick={onClick}
            data-testid='icon-button'
            aria-label='Icon Button'
        >
            <Icon className={iconSizeStyle[size]} />
        </button>
    );
};
