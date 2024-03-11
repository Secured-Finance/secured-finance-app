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
            className={clsx({
                'rotate-180': expanded,
                'h-4 w-4 text-white tablet:h-5 tablet:w-5': variant === 'solid',
                'h-3 w-3 text-neutral-400 tablet:h-4 tablet:w-4':
                    variant !== 'solid',
            })}
            data-testid='chevron-down-icon'
        />
    );
};
