import { Popover } from '@headlessui/react';
import { useState } from 'react';
import InformationCircle from 'src/assets/icons/information-circle.svg';

export const InformationPopover = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div
                className='pointer-events-auto'
                data-testid='information-popover'
            >
                <Popover className='relative'>
                    {() => (
                        <>
                            <Popover.Button className='flex items-center focus:outline-none'>
                                <InformationCircle
                                    className='cursor-pointer'
                                    data-testid='information-circle'
                                    onMouseEnter={() => setOpen(true)}
                                    onMouseLeave={() => setOpen(false)}
                                    width={12}
                                    height={12}
                                />
                            </Popover.Button>
                            {open && children && (
                                <Popover.Panel
                                    className='absolute z-10 mt-2 w-screen max-w-[256px]'
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
            </div>
        </>
    );
};
