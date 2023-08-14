import { ChevronDownIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';

export const ExpandIndicator = ({
    expanded,
    variant = 'solid',
}: {
    expanded: boolean;
    variant?: 'solid' | 'opaque';
}) => {
    const className =
        variant === 'solid'
            ? 'h-5 w-5 text-white'
            : 'h-3 w-3 text-white opacity-50';
    return (
        <ChevronDownIcon
            className={classNames(className, {
                'rotate-180': expanded,
            })}
            data-testid='chevron-down-icon'
        />
    );
};
