import { Popover } from '@headlessui/react';
import { useState } from 'react';
import InformationCircle from 'src/assets/icons/information-circle.svg';

interface InformationPopoverProps {
    text: string;
}

export const InformationPopover = ({ text = '' }: InformationPopoverProps) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className='w-full max-w-[256px]'>
                <Popover className='relative'>
                    {() => (
                        <>
                            <Popover.Button className='flex items-center focus:outline-none'>
                                <InformationCircle
                                    className='cursor-pointer'
                                    data-testid='information-circle'
                                    onMouseEnter={() => setOpen(true)}
                                    onMouseLeave={() => setOpen(false)}
                                />
                            </Popover.Button>
                            {open && text && (
                                <Popover.Panel
                                    className='absolute z-10 mt-2'
                                    static
                                >
                                    {() => (
                                        <div className='typography-dropdown-selection-label relative w-fit overflow-hidden rounded-xl border border-black-60 bg-gunMetal p-4 text-neutral-8 shadow-dropdown'>
                                            {text}
                                        </div>
                                    )}
                                </Popover.Panel>
                            )}
                        </>
                    )}
                </Popover>
            </div>
        </>
    );
};
