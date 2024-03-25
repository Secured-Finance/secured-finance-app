import { Popover } from '@headlessui/react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { cloneElement, useState } from 'react';
import { Alignment } from 'src/types';
import { iconStyles, modeStyles } from './constants';
import { TooltipMode } from './types';

export const Tooltip = ({
    iconElement,
    children,
    align = 'center',
    maxWidth = 'large',
    mode = TooltipMode.Dark,
}: {
    iconElement: React.ReactNode;
    children: React.ReactNode;
    align?: Alignment;
    maxWidth?: 'small' | 'large';
    mode?: TooltipMode;
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <Popover
            className='pointer-events-auto relative overflow-visible'
            data-testid='tooltip'
        >
            {() => (
                <div
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                    className='relative overflow-visible py-4' // TODO: remove py-4 once we are able to use NextUI for tooltips
                >
                    <Popover.Button
                        className='flex cursor-pointer items-center focus:outline-none'
                        as='div'
                    >
                        {cloneElement(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            iconElement as React.ReactElement<any>
                        )}
                    </Popover.Button>
                    {isOpen && children && (
                        <Popover.Panel
                            className={clsx(
                                'absolute z-50 mt-2 flex w-screen justify-center',
                                {
                                    'max-w-[240px]': maxWidth === 'large',
                                    'max-w-[165px]': maxWidth === 'small',
                                    'left-1/2 -translate-x-1/2 transform':
                                        align === 'center',
                                    '-left-7': align === 'right',
                                    '-right-7': align === 'left',
                                }
                            )}
                            role='tooltip'
                            static
                        >
                            <div
                                className={clsx(
                                    'relative flex w-fit gap-2.5 overflow-hidden whitespace-normal rounded-lg px-3 py-2.5 text-left text-[0.6875rem] leading-[1.36] text-neutral-50 shadow-dropdown light:text-neutral-900 laptop:text-xs laptop:leading-[1.66]',
                                    modeStyles[mode]
                                )}
                            >
                                <InformationCircleIcon
                                    data-testid='information-circle'
                                    className={clsx(
                                        'mt-[3px] h-2.5 w-2.5 shrink-0 laptop:h-3 laptop:w-3',
                                        iconStyles[mode]
                                    )}
                                />
                                {children}
                            </div>
                        </Popover.Panel>
                    )}
                </div>
            )}
        </Popover>
    );
};
