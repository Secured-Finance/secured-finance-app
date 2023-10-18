import { Popover } from '@headlessui/react';
import classNames from 'classnames';
import { cloneElement, useState } from 'react';
import InformationCircle from 'src/assets/icons/information-circle.svg';
import { Alignment } from 'src/types';

const InformationCircleIcon = (
    <InformationCircle
        className='cursor-pointer'
        data-testid='information-circle'
        width={12}
        height={12}
    />
);

export const Tooltip = ({
    iconElement = InformationCircleIcon,
    children,
    align = 'center',
    maxWidth = 'large',
}: {
    iconElement?: React.ReactNode;
    children: React.ReactNode;
    align?: Alignment;
    maxWidth?: 'small' | 'large';
}) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover
            className='pointer-events-auto relative overflow-visible'
            data-testid='tooltip'
        >
            {() => (
                <>
                    <Popover.Button
                        className='flex cursor-pointer items-center focus:outline-none'
                        as='div'
                    >
                        {cloneElement(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            iconElement as React.ReactElement<any>,
                            {
                                onMouseEnter: () => setOpen(true),
                                onMouseLeave: () => setOpen(false),
                            }
                        )}
                    </Popover.Button>
                    {open && children && (
                        <Popover.Panel
                            className={classNames(
                                'absolute z-10 mt-2 flex w-screen justify-center',
                                {
                                    'max-w-[256px]': maxWidth === 'large',
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
                            <div className='typography-caption-3 relative w-fit overflow-hidden whitespace-normal rounded-lg border border-black-20 bg-gunMetal p-4 text-left text-neutral-8 shadow-dropdown'>
                                {children}
                            </div>
                        </Popover.Panel>
                    )}
                </>
            )}
        </Popover>
    );
};
