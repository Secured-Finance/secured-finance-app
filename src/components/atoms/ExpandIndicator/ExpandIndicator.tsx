import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';

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
    if (!expanded) {
        return (
            <ChevronDownIcon
                className={className}
                data-testid='chevron-down-icon'
            />
        );
    } else {
        return (
            <ChevronUpIcon
                className={className}
                data-testid='chevron-up-icon'
            />
        );
    }
};
