import clsx from 'clsx';
import { HighlightChip } from '../HighlightChip';
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
}

// TODO: handle disabled state as in TabSelector (Default) story
export const Tab = ({
    text,
    active = false,
    highlight,
    variant = TabVariant.Blue,
    isFullHeight,
}: TabProps) => {
    return (
        <div
            className={clsx('group flex w-full flex-col text-center', {
                'h-full': isFullHeight,
            })}
        >
            <div
                className={clsx('h-1 w-full', {
                    [lineStyle[variant]]: active,
                    'bg-transparent': !active,
                })}
            ></div>
            <div
                className={clsx(
                    'flex h-full items-center justify-center gap-2 px-[1.61rem] pb-3.5 pt-2.5 laptop:px-[1.2rem] laptop:pb-[1.375rem] laptop:pt-[1.125rem]',
                    {
                        [`${bgGradientStyle[variant]} bg-gradient-to-b`]:
                            active,
                        'h-full': isFullHeight,
                        'h-auto': !isFullHeight,
                    }
                )}
            >
                <p
                    className={clsx(
                        'h-4 whitespace-nowrap text-xs leading-[1.33] duration-300 group-hover:opacity-100 group-hover:ease-in-out laptop:text-sm',
                        {
                            [`font-semibold ${[textStyle[variant]]}`]: active,
                            'text-slateGray light:text-neutral-600': !active,
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
