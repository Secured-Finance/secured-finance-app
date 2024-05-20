import clsx from 'clsx';
import { HighlightChip } from '../HighlightChip';

export interface NavStylesProps {
    bgColorActive: string;
    textClassActive: string;
    gradient: {
        from: string;
        to: string;
    };
}

interface NavTabProps {
    text: string;
    active: boolean;
    highlight?: {
        text: string;
        size: 'small' | 'large';
        visible: boolean;
    };
    navStyles?: NavStylesProps;
}

export const NavTab = ({
    text,
    active = false,
    highlight,
    navStyles,
}: NavTabProps) => {
    return (
        <div className='group flex h-full w-full flex-col text-center'>
            <div
                className={clsx('h-1 w-full', {
                    [navStyles?.bgColorActive || 'bg-starBlue']: active,
                })}
            ></div>
            <div
                className={clsx(
                    'flex h-full items-center justify-center gap-2 px-[30px]',
                    {
                        [`${
                            navStyles
                                ? `bg-gradient-to-b ${navStyles.gradient.from} ${navStyles.gradient.to}`
                                : 'bg-gradient-to-b from-tabGradient-2 to-tabGradient-1'
                        }`]: active,
                    }
                )}
            >
                <p
                    className={clsx(
                        'typography-nav-menu-default h-4 whitespace-nowrap duration-300 group-hover:opacity-100 group-hover:ease-in-out',
                        {
                            [navStyles?.textClassActive || '']: active,
                            'text-neutral-8': !active || !navStyles,
                            'opacity-100': active,
                            'opacity-70': !active,
                        }
                    )}
                    data-testid={`${text}-tab`}
                >
                    {text}
                </p>
                {highlight && highlight.visible && (
                    <HighlightChip
                        text={highlight.text}
                        size={highlight.size}
                    />
                )}
            </div>
        </div>
    );
};
