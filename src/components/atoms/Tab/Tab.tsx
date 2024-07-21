import clsx from 'clsx';
import { HighlightChip } from 'src/components/atoms';
import { bgGradientStyle, lineStyle, textStyle } from './constants';
import { TabVariant } from './types';

interface TabProps {
    text: string;
    active: boolean;
    highlight?: {
        text: string;
        size: 'small' | 'large';
        visible: boolean;
    };
    variant?: TabVariant;
    isFullHeight?: boolean;
    className?: string;
    suffixEle?: React.ReactNode;
    disabled?: boolean;
}

export const Tab = ({
    text,
    active = false,
    highlight,
    variant = TabVariant.Blue,
    isFullHeight,
    className,
    suffixEle,
    disabled,
}: TabProps) => {
    return (
        <div
            className={clsx(
                'group relative flex h-full w-full flex-col px-[1.625rem] pb-3.5 pt-3.5 text-center laptop:px-[1.2rem] laptop:py-[18px]',
                className,
                {
                    [`${bgGradientStyle[variant]} bg-gradient-to-b`]:
                        active && !disabled,
                    'h-full': isFullHeight,
                    'pointer-events-none bg-transparent': disabled,
                }
            )}
        >
            <div
                className={clsx('absolute left-0 top-0 h-1 w-full', {
                    [lineStyle[variant]]: active,
                    'bg-transparent': !active || disabled,
                })}
            />
            <div
                className={clsx(
                    'flex h-full items-center justify-center gap-2',
                    {
                        'h-full': isFullHeight,
                        'h-auto': !isFullHeight,
                    }
                )}
            >
                <p
                    className={clsx(
                        'flex items-center gap-2.5 whitespace-nowrap text-xs leading-4 duration-300 group-hover:opacity-100 group-hover:ease-in-out laptop:text-sm',
                        {
                            [`${[textStyle[variant]]}`]: active && !disabled,
                            'text-neutral-200': !active,
                            'text-neutral-400': disabled,
                        }
                    )}
                    data-testid={`${text}-tab`}
                >
                    {text}
                    {suffixEle && suffixEle}
                </p>
                {highlight?.visible && (
                    <HighlightChip
                        text={highlight.text}
                        size={highlight.size}
                    />
                )}
            </div>
        </div>
    );
};
