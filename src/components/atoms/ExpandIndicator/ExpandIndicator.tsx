import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

export const ExpandIndicator = ({
    expanded,
    variant = 'solid',
}: {
    expanded: boolean;
    variant?: 'solid' | 'opaque';
}) => {
    return (
        <ChevronDownIcon
            className={clsx('text-neutral-400', {
                'rotate-180': expanded,
                'h-4 w-4 tablet:h-5 tablet:w-5': variant === 'solid',
                'h-3 w-3 opacity-50 tablet:h-4 tablet:w-4': variant !== 'solid',
            })}
            data-testid='chevron-down-icon'
        />
    );
};
