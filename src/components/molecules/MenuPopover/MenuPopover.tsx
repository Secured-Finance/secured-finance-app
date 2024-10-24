import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { ArrowUpRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { Fragment } from 'react';
import { MenuItem, Separator } from 'src/components/atoms';
import { LinkList } from 'src/utils';

export const MenuPopover = () => {
    return (
        <div className='flex h-full items-center justify-center px-[30px] laptop:w-[100px]'>
            <Popover className='relative'>
                {({ close }) => (
                    <>
                        <Popover.Button
                            as='button'
                            data-cy='popover-button'
                            className='typography-nav-menu-default flex h-4 flex-row items-center gap-1 whitespace-nowrap text-neutral-200 outline-none duration-300 focus-within:text-secondary7 focus-within:opacity-100 hover:text-secondary7 hover:opacity-100 hover:ease-in-out'
                        >
                            <p>More</p>
                            <ChevronDownIcon className='h-4 w-4' />
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
                            <Popover.Panel
                                className='absolute -left-6 z-10 mt-5 w-56'
                                role='menu'
                            >
                                <div className='relative flex flex-col overflow-hidden rounded-lg bg-gunMetal px-3 py-[14px] shadow-dropdown'>
                                    {LinkList.map((link, index) => {
                                        return (
                                            <button
                                                key={index}
                                                role='menuitem'
                                                onClick={close}
                                                className={clsx({
                                                    'desktop:hidden':
                                                        link.isInternal,
                                                })}
                                            >
                                                <MenuItem
                                                    text={link.text}
                                                    icon={link.icon}
                                                    link={link.href}
                                                    isInternal={link.isInternal}
                                                    badge={<ExternalIcon />}
                                                />
                                                {index !==
                                                    LinkList.length - 1 && (
                                                    <div className='py-2'>
                                                        <Separator />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </div>
    );
};

const ExternalIcon = () => <ArrowUpRightIcon className='h-4 w-4 text-white' />;
