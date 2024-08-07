import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIsGlobalItayose } from 'src/hooks';
import { TRADING_LINKS } from './constants';

export const TradingDropdown = () => {
    const router = useRouter();
    const { data: isGlobalItayose } = useIsGlobalItayose();
    const { text, links, alternateLinks } = TRADING_LINKS;

    const isActive =
        links.some(item => item.link === router.pathname) ||
        alternateLinks.includes(router.pathname);

    return (
        <Menu>
            {({ close }) => (
                <>
                    <Menu.Button>
                        <div className='group relative flex h-full w-full flex-col text-center'>
                            <div
                                className={clsx(
                                    'absolute left-0 top-0 h-1 w-full',
                                    {
                                        'bg-starBlue': isActive,
                                    }
                                )}
                            />
                            <div
                                className={clsx(
                                    'flex h-full items-center justify-center gap-2 laptop:w-[100px]',
                                    {
                                        'bg-gradient-to-b from-tabGradient-blue-start to-tabGradient-blue-end':
                                            isActive,
                                    }
                                )}
                            >
                                <p
                                    className={clsx(
                                        'typography-nav-menu-default flex h-4 items-center gap-1 whitespace-nowrap duration-300',
                                        {
                                            'text-neutral-50': isActive,
                                            'text-neutral-200': !isActive,
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
                        <Menu.Items className='absolute -left-[100px] top-16 flex w-[128px] flex-col rounded-b-xl bg-neutral-800 py-1'>
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
                                            href={
                                                isGlobalItayose
                                                    ? '/itayose'
                                                    : tradingLink.link
                                            }
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
