import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

export const ExpandIndicator = ({
    expanded,
    variant = 'solid',
}: {
    expanded: boolean;
    variant?: 'solid' | 'opaque';
}) => {
    const className =
        variant === 'solid'
            ? 'h-3.5 w-3.5 laptop:h-5 laptop:w-5 text-white'
            : 'h-3 w-3 text-white opacity-50';
    return (
        <ChevronDownIcon
            className={clsx(className, {
                'rotate-180': expanded,
            })}
            data-testid='chevron-down-icon'
        />
    );
};
