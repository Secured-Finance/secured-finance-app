import type { TippyProps } from '@tippyjs/react';
import Tippy from '@tippyjs/react/headless';
import clsx from 'clsx';
import { cloneElement } from 'react';
import { useBreakpoint } from 'src/hooks';
import { Alignment } from 'src/types';
import { modeStyles } from './constants';
import { TooltipMode } from './types';

type TooltipProps = Pick<TippyProps, 'placement'> &
    React.PropsWithChildren<{
        iconElement: React.ReactNode;
        align?: Alignment;
        mode?: TooltipMode;
        disabled?: boolean;
        className?: string;
    }>;

export const Tooltip = ({
    iconElement,
    children,
    align,
    mode = TooltipMode.Dark,
    placement,
    disabled,
    className,
}: TooltipProps) => {
    const isMobile = useBreakpoint('tablet');

    return (
        <Tippy
            interactive
            disabled={disabled}
            placement={isMobile ? 'auto-start' : placement}
            render={() => (
                <div
                    className={clsx(
                        'typography-desktop-body-6 laptop:typography-desktop-body-5 relative flex w-fit max-w-60 gap-2.5 overflow-hidden whitespace-normal rounded-lg border px-2 py-1 text-left text-neutral-50 shadow-dropdown laptop:px-3',
                        modeStyles[mode],
                        {
                            'left-24': align === 'right',
                        }
                    )}
                >
                    {children}
                </div>
            )}
            role='tooltip'
        >
            <div
                className={clsx(
                    'pointer-events-auto flex items-start focus:outline-none',
                    {
                        'cursor-pointer': !disabled,
                    },
                    className
                )}
            >
                {cloneElement(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    iconElement as React.ReactElement<any>
                )}
            </div>
        </Tippy>
    );
};

// Wraps children in a tooltip only when there is content, e.g. why a button is disabled
export const OptionalTooltip = ({
    content,
    fullWidth = false,
    children,
}: {
    content?: string;
    fullWidth?: boolean;
    children: React.ReactElement;
}) => {
    if (!content) return children;

    // Own wrapper so the tooltip renders right after its trigger, as tippy needs for keyboard access
    return (
        <div className={clsx({ 'w-full': fullWidth })}>
            <Tooltip
                iconElement={children}
                placement='top'
                className={clsx({ 'w-full': fullWidth })}
            >
                {content}
            </Tooltip>
        </div>
    );
};
