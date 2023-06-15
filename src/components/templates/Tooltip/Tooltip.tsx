import { Popover } from '@headlessui/react';
import React, { useState } from 'react';

export const Tooltip = ({
    iconElement,
    children,
}: {
    iconElement: React.ReactNode;
    children: React.ReactNode;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover
            className='pointer-events-auto relative overflow-visible'
            data-testid='information-popover'
        >
            {() => (
                <>
                    <Popover.Button
                        className='flex items-center focus:outline-none'
                        as='div'
                    >
                        {React.cloneElement(
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
                            className='absolute z-10 mt-2 w-screen max-w-[256px]'
                            role='tooltip'
                            static
                        >
                            <div className='typography-caption-3 relative w-fit overflow-hidden rounded-lg border border-black-20 bg-gunMetal p-4 text-neutral-8 shadow-dropdown'>
                                {children}
                            </div>
                        </Popover.Panel>
                    )}
                </>
            )}
        </Popover>
    );
};
