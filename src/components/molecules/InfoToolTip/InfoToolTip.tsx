import { InformationCircleIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { Tooltip } from 'src/components/templates';

export const InfoToolTip = ({
    iconColor = 'gray',
    iconSize = 'medium',
    maxWidth,
    align,
    children,
}: {
    iconColor?: 'gray' | 'white' | 'yellow';
    iconSize?: 'small' | 'medium' | 'large';
    maxWidth?: Parameters<typeof Tooltip>[0]['maxWidth'];
    align?: Parameters<typeof Tooltip>[0]['align'];
    children: React.ReactNode;
}) => {
    const Icon = (
        <InformationCircleIcon
            className={classNames('cursor-pointer', {
                'h-3 w-3': iconSize === 'small',
                'h-4 w-4': iconSize === 'medium',
                'h-5 w-5': iconSize === 'large',
                'text-slateGray': iconColor === 'gray',
                'text-white': iconColor === 'white',
                'text-yellow': iconColor === 'yellow',
            })}
            data-testid='information-circle'
        />
    );

    return (
        <Tooltip iconElement={Icon} align={align} maxWidth={maxWidth}>
            {children}
        </Tooltip>
    );
};
