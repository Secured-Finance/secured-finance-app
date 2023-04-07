import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Separator } from '../../atoms/Separator';
import Discord from 'src/assets/icons/discord.svg';
import Medium from 'src/assets/icons/medium.svg';
import Twitter from 'src/assets/icons/twitter.svg';
import SF from 'src/assets/icons/SF-KO.svg';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import { MenuItem } from 'src/components/atoms/MenuItem';

export const MenuPopover = ({}) => {
    return (
        <>
            <div className='flex h-full items-center justify-center px-8'>
                <Popover className='relative'>
                    {({}) => (
                        <>
                            <Popover.Button
                                data-cy='popover-button'
                                className='typography-nav-menu-default h-4 whitespace-nowrap text-neutral-8 opacity-70 duration-300 focus:outline-none group-hover:opacity-100 group-hover:ease-in-out'
                            >
                                More...
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
                                        <div className='relative flex flex-col space-y-2 border border-black bg-universeBlue p-2 text-white shadow-dropdown'>
                                            <MenuItem
                                                text='Secured Finance landing page'
                                                icon={
                                                    <SF className='h-6 w-6 rounded-full ' />
                                                }
                                                badge={
                                                    <ExternalLinkIcon className='h-4 w-4 text-slateGray' />
                                                }
                                                link='https://secured.finance/'
                                            />
                                            <Separator />
                                            <MenuItem
                                                text='Documentation'
                                                icon={
                                                    <Medium className='h-6 w-6 text-slateGray' />
                                                }
                                                badge={
                                                    <ExternalLinkIcon className='h-4 w-4 text-slateGray' />
                                                }
                                                link='https://blog.secured.finance/'
                                            />
                                            <Separator />
                                            <MenuItem
                                                text='Follow us on twitter'
                                                icon={
                                                    <Twitter className='h-6 w-6 text-slateGray' />
                                                }
                                                badge={
                                                    <ExternalLinkIcon className='h-4 w-4 text-slateGray' />
                                                }
                                                link='https://twitter.com/Secured_Fi'
                                            />
                                            <Separator />
                                            <MenuItem
                                                text='Join us on Discord'
                                                icon={
                                                    <Discord className='h-6 w-6 text-slateGray' />
                                                }
                                                badge={
                                                    <ExternalLinkIcon className='h-4 w-4 text-slateGray' />
                                                }
                                                link='https://discord.com/invite/FqrdfQgmjT'
                                            />
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
