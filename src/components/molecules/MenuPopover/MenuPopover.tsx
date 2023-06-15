import { Popover, Transition } from '@headlessui/react';
import {
    ArrowUpRightIcon,
    EllipsisHorizontalIcon,
} from '@heroicons/react/24/solid';
import { Fragment } from 'react';
import { MenuItem, Separator } from 'src/components/atoms';
import { LinkList } from 'src/utils';

export const MenuPopover = ({}) => {
    return (
        <>
            <div className='flex h-full w-fit items-center justify-center px-4'>
                <Popover className='relative'>
                    {({}) => (
                        <>
                            <Popover.Button
                                data-cy='popover-button'
                                className='typography-nav-menu-default mt-1 flex h-4 flex-row items-center whitespace-nowrap text-planetaryPurple opacity-70 duration-300 focus:outline-none group-hover:opacity-100 group-hover:ease-in-out'
                            >
                                <p>More</p>
                                <EllipsisHorizontalIcon className='ml-1 h-5 w-5' />
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter='transition ease-out duration-200'
                                enterFrom='opacity-0 translate-y-5'
                                enterTo='opacity-100 translate-y-0'
                                leave='transition ease-in duration-150'
                                leaveFrom='opacity-100 translate-y-0'
                                leaveTo='opacity-0 translate-y-5'
                            >
                                <Popover.Panel className='absolute left-40 z-10 mt-2 w-80 -translate-x-1/2'>
                                    <div className='overflow-hidden rounded-lg shadow-sm'>
                                        <div className='relative flex flex-col space-y-2 border border-black bg-gunMetal p-2 shadow-dropdown'>
                                            {LinkList.map((link, index) => {
                                                return (
                                                    <div key={index}>
                                                        <MenuItem
                                                            text={link.text}
                                                            icon={link.icon}
                                                            link={link.href}
                                                            badge={
                                                                <ExternalIcon />
                                                            }
                                                        />
                                                        {index !==
                                                            LinkList.length -
                                                                1 && (
                                                            <Separator />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>
            </div>
        </>
    );
};

const ExternalIcon = () => (
    <ArrowUpRightIcon className='mt-1.5 h-4 w-4 text-white' />
);
