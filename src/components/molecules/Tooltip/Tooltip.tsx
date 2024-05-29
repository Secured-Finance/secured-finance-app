import { Tooltip as NextTooltip, TooltipPlacement } from '@nextui-org/tooltip';
import clsx from 'clsx';
import { cloneElement } from 'react';
import { Alignment } from 'src/types';
import { modeStyles, tooltipOptions } from './constants';
import { TooltipMode } from './types';

export const Tooltip = ({
    iconElement,
    children,
    align,
    mode = TooltipMode.Dark,
    placement,
    disabled,
}: {
    iconElement: React.ReactNode;
    children: React.ReactNode;
    align?: Alignment;
    mode?: TooltipMode;
    placement?: TooltipPlacement;
    disabled?: boolean;
}) => {
    return (
        <NextTooltip
            isDisabled={disabled}
            showArrow={true}
            offset={0}
            placement={placement}
            content={
                <div
                    className={clsx(
                        'typography-desktop-body-6 laptop:typography-desktop-body-5 relative flex w-fit max-w-[240px] gap-2.5 overflow-hidden whitespace-normal rounded-lg border px-2 py-1 text-left text-neutral-50 shadow-dropdown laptop:px-3',
                        modeStyles[mode],
                        {
                            'left-24': align === 'right',
                        }
                    )}
                >
                    {children}
                </div>
            }
            role='tooltip'
            {...tooltipOptions}
        >
            <div
                className={clsx(
                    'pointer-events-auto flex items-center focus:outline-none',
                    {
                        'cursor-pointer': !disabled,
                    }
                )}
            >
                {cloneElement(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    iconElement as React.ReactElement<any>
                )}
            </div>
        </NextTooltip>
    );
};
