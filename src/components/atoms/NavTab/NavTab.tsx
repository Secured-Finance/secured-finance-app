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
    suffixIcon?: React.ReactNode;
}

export const NavTab = ({
    text,
    suffixIcon,
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
                        'flex h-4 items-center whitespace-nowrap text-xs duration-300 group-hover:opacity-100 group-hover:ease-in-out laptop:text-sm',
                        {
                            [navStyles?.textClassActive || '']: active,
                            'text-neutral-8': !active || !navStyles,
                            'font-semibold opacity-100': active,
                            'opacity-70': !active,
                        }
                    )}
                    data-testid={`${text}-tab`}
                >
                    {text}
                    {suffixIcon}
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
