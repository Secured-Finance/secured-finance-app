import { InformationCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Tooltip } from 'src/components/molecules';

export const InfoToolTip = ({
    iconColor = 'gray',
    iconSize = 'medium',
    align,
    children,
    placement,
}: {
    iconColor?: 'gray' | 'white' | 'yellow';
    iconSize?: 'small' | 'medium' | 'large';
    align?: Parameters<typeof Tooltip>[0]['align'];
    placement?: Parameters<typeof Tooltip>[0]['placement'];
    children: React.ReactNode;
}) => {
    const Icon = (
        <InformationCircleIcon
            className={clsx('cursor-pointer', {
                'h-3 w-3': iconSize === 'small',
                'h-4 w-4': iconSize === 'medium',
                'h-5 w-5': iconSize === 'large',
                'text-slateGray': iconColor === 'gray',
                'text-white': iconColor === 'white',
                'text-warning-500': iconColor === 'yellow',
            })}
            data-testid='information-circle'
        />
    );

    return (
        <Tooltip iconElement={Icon} align={align} placement={placement}>
            {children}
        </Tooltip>
    );
};
