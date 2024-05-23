import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { TRADING_LINKS } from './constants';

export const TradingDropdown = () => {
    const router = useRouter();
    const { text, links, alternateLinks } = TRADING_LINKS;

    const isActive =
        links.some(item => item.link === router.pathname) ||
        alternateLinks.includes(router.pathname);

    return (
        <Menu>
            {({ close }) => (
                <>
                    <Menu.Button>
                        <div className='group flex h-full w-full flex-col text-center'>
                            <div
                                className={clsx('h-1 w-full', {
                                    'bg-starBlue': isActive,
                                })}
                            />
                            <div
                                className={clsx(
                                    'flex h-full items-center justify-center gap-2 pl-[30px] pr-[23px]',
                                    {
                                        'bg-gradient-to-b from-tabGradient-2 to-tabGradient-1':
                                            isActive,
                                    }
                                )}
                            >
                                <p
                                    className={clsx(
                                        'typography-nav-menu-default flex h-4 items-center gap-2.5 whitespace-nowrap text-neutral-8 duration-300 group-hover:opacity-100 group-hover:ease-in-out',
                                        {
                                            'opacity-100': isActive,
                                            'opacity-70': !isActive,
                                        }
                                    )}
                                    data-testid={`${text}-tab`}
                                >
                                    {text}{' '}
                                    <ChevronDownIcon
                                        className={clsx(
                                            'h-4 w-4 text-neutral-400'
                                        )}
                                    />
                                </p>
                            </div>
                        </div>
                    </Menu.Button>
                    <Transition
                        className='relative'
                        enter='transition duration-100 ease-out'
                        enterFrom='transform scale-95 opacity-0'
                        enterTo='transform scale-100 opacity-100'
                        leave='transition duration-75 ease-out'
                        leaveFrom='transform scale-100 opacity-100'
                        leaveTo='transform scale-95 opacity-0'
                    >
                        <Menu.Items className='absolute -left-[128px] top-20 flex w-[128px] flex-col rounded-b-xl bg-neutral-800 py-1'>
                            {links.map((tradingLink, i) => {
                                return (
                                    <Menu.Item
                                        key={i}
                                        as='div'
                                        aria-label={tradingLink.text}
                                        className={clsx('px-2 py-[7px]', {
                                            'border-b border-neutral-600':
                                                i === 0,
                                        })}
                                    >
                                        <Link
                                            href={tradingLink.link}
                                            className={clsx(
                                                'flex items-center rounded px-2 py-1 hover:bg-neutral-700'
                                            )}
                                            onClick={() => close()}
                                        >
                                            <span className='typography-desktop-body-4 text-neutral-50'>
                                                {tradingLink.text}
                                            </span>
                                        </Link>
                                    </Menu.Item>
                                );
                            })}
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    );
};
