import { Menu, Transition } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { ArrowUpIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import Link from 'next/link';
import { HTMLAttributes, LegacyRef, forwardRef, useState } from 'react';
import Burger from 'src/assets/img/burger.svg';
import SFLogoSmall from 'src/assets/img/small-logo.svg';
import { Closable } from 'src/components/templates';
import { LinkList } from 'src/utils';
import { UrlObject } from 'url';

const mobileLinkClassName =
    'text-[1.25rem] font-semibold -tracking-[0.0125rem] text-primary-50';

const NextLink = forwardRef(
    (
        props: HTMLAttributes<HTMLAnchorElement> & { href: string | UrlObject },
        ref: LegacyRef<HTMLAnchorElement>
    ) => {
        const { href, children, ...rest } = props;
        return (
            <Link href={href}>
                <a {...rest} ref={ref}>
                    {children}
                </a>
            </Link>
        );
    }
);
NextLink.displayName = 'NextLink';

const MenuItemLink = ({ text, link }: { text: string; link: string }) => {
    return (
        <Menu.Item>
            {({ active }) => (
                <NextLink
                    href={link}
                    className={clsx(
                        'flex w-full items-center justify-start whitespace-nowrap px-2 py-2 text-center',
                        mobileLinkClassName,
                        {
                            'text-primary-8 border-l-4 border-starBlue bg-gradient-to-r from-[#6A76B159] via-[#4A5BAF1F] to-[#394DAE00]':
                                active,
                        }
                    )}
                >
                    {text}
                </NextLink>
            )}
        </Menu.Item>
    );
};

const MobileItemLink = ({ text, href }: { text: string; href: string }) => {
    return (
        <Menu.Item>
            {({ active }) => (
                <a
                    className={clsx(
                        'flex w-full flex-row items-center justify-start gap-3 whitespace-nowrap px-3 py-2 text-center',
                        mobileLinkClassName,
                        {
                            'rounded-2xl bg-[#233447] text-neutral-8': active,
                        }
                    )}
                    href={href}
                    target='_blank'
                    rel='noreferrer'
                >
                    <p>{text}</p>
                    <ArrowUpIcon
                        className={clsx('mt-1 h-4 w-4 rotate-45 text-white', {
                            inline: active,
                            hidden: !active,
                        })}
                    />
                </a>
            )}
        </Menu.Item>
    );
};

export const HamburgerMenu = ({
    links,
}: {
    links: { label: string; link: string }[];
}) => {
    const [showMore, setShowMore] = useState(false);

    return (
        <Menu>
            {({ open, close }) => (
                <>
                    <Menu.Button aria-label='Hamburger Menu'>
                        <Burger className='h-6 w-6' />
                    </Menu.Button>
                    {open && (
                        <div className='fixed inset-0 z-40 hidden bg-neutral-800 opacity-50 tablet:block' />
                    )}
                    <Transition
                        className='fixed inset-0 z-50 tablet:left-auto tablet:right-0 tablet:w-[52%] tablet:min-w-[25rem] tablet:max-w-[37.5rem]'
                        enter='transition duration-100 ease-out'
                        enterFrom='transform scale-95 opacity-0'
                        enterTo='transform scale-100 opacity-100'
                        leave='transition duration-75 ease-out'
                        leaveFrom='transform scale-100 opacity-100'
                        leaveTo='transform scale-95 opacity-0'
                    >
                        <Menu.Items
                            as='div'
                            className={clsx(
                                'flex h-screen w-full flex-col gap-8 overflow-y-auto bg-neutral-900 p-4 text-neutral-4'
                            )}
                        >
                            <Closable onClose={close}>
                                <div className='fixed tablet:mt-1'>
                                    <SFLogoSmall className='h-5 w-[22.75px]' />
                                </div>
                                <div className='w-full flex-col items-start'>
                                    {links.map(link => (
                                        <MenuItemLink
                                            key={link.label}
                                            text={link.label}
                                            link={link.link}
                                        />
                                    ))}

                                    <Menu.Item
                                        as='div'
                                        className={clsx(
                                            'flex w-full items-center',
                                            mobileLinkClassName
                                        )}
                                    >
                                        {({ active }) => (
                                            <button
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setShowMore(!showMore);
                                                }}
                                                aria-label='Show More'
                                                className={clsx(
                                                    'flex items-center justify-between gap-2 px-2 py-2 text-center focus:outline-none',
                                                    {
                                                        'border-l-4 border-starBlue bg-gradient-to-r from-[#6A76B159] via-[#4A5BAF1F] to-[#394DAE00] text-neutral-8':
                                                            active,
                                                    }
                                                )}
                                            >
                                                More
                                                <ChevronRightIcon
                                                    className={clsx(
                                                        'relative top-[1px] inline h-6 w-6',
                                                        {
                                                            'rotate-90':
                                                                showMore,
                                                        }
                                                    )}
                                                />
                                            </button>
                                        )}
                                    </Menu.Item>

                                    {showMore && (
                                        <div className='w-full px-4'>
                                            {LinkList.map(link => (
                                                <MobileItemLink
                                                    key={link.text}
                                                    text={link.text}
                                                    href={link.href}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Closable>
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    );
};
