import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip as NextTooltip, TooltipPlacement } from '@nextui-org/tooltip';
import clsx from 'clsx';
import { cloneElement } from 'react';
import { Alignment } from 'src/types';
import { iconStyles, modeStyles, tooltipOptions } from './constants';
import { TooltipMode } from './types';

export const Tooltip = ({
    iconElement,
    children,
    hasIcon = true,
    align,
    mode = TooltipMode.Dark,
    placement,
    disabled,
}: {
    iconElement: React.ReactNode;
    children: React.ReactNode;
    hasIcon?: boolean;
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
                        'relative flex w-fit max-w-[240px] gap-2.5 overflow-hidden whitespace-normal rounded-lg border px-3 py-2.5 text-left text-[11px] leading-[15px] text-neutral-50 shadow-dropdown laptop:text-xs laptop:leading-5',
                        modeStyles[mode],
                        {
                            'left-24': align === 'right',
                        }
                    )}
                >
                    {hasIcon && (
                        <InformationCircleIcon
                            data-testid='information-circle'
                            className={clsx(
                                'mt-[3px] h-2.5 w-2.5 shrink-0 laptop:h-3 laptop:w-3',
                                iconStyles[mode]
                            )}
                        />
                    )}
                    {children}
                </div>
            }
            role='tooltip'
            {...tooltipOptions}
        >
            <div
                className={clsx('flex items-center focus:outline-none', {
                    'cursor-pointer': !disabled,
                })}
            >
                {cloneElement(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    iconElement as React.ReactElement<any>
                )}
            </div>
        </NextTooltip>
    );
};
