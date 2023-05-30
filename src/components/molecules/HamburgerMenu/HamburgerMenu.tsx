import { Menu } from '@headlessui/react';
import { ArrowUpIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import Link from 'next/link';
import React, { HTMLAttributes, LegacyRef, useState } from 'react';
import Burger from 'src/assets/img/burger.svg';
import SFLogoSmall from 'src/assets/img/small-logo.svg';
import { Closable } from 'src/components/templates';
import { UrlObject } from 'url';

const EXTRA_LINKS = [
    {
        text: 'Landing Page',
        href: 'https://secured.finance/',
    },
    {
        text: 'Documentation',
        href: 'https://blog.secured.finance/',
    },
    {
        text: 'Follow us on Twitter',
        href: 'https://twitter.com/Secured_Fi',
    },
    {
        text: 'Join our Discord',
        href: 'https://discord.com/invite/FqrdfQgmjT',
    },
];

const NextLink = React.forwardRef(
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
                    className={classNames(
                        'flex h-16 w-full items-center justify-start px-9 py-4 text-center',
                        {
                            'border-l-4 border-starBlue bg-gradient-to-r from-[#6A76B159] via-[#4A5BAF1F] to-[#394DAE00] text-neutral-8':
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
                    className={classNames(
                        'flex h-16 w-full flex-row items-center justify-start gap-3 px-9 py-4 text-center',
                        {
                            'border-l-4 bg-[#233447] text-neutral-8': active,
                        }
                    )}
                    href={href}
                    target='_blank'
                    rel='noreferrer'
                >
                    <p>{text}</p>
                    <ArrowUpIcon
                        className={classNames(
                            'mt-2 h-5 w-5 rotate-45 text-white',
                            {
                                inline: active,
                                hidden: !active,
                            }
                        )}
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
    const [showMore] = useState(true);
    return (
        <Menu>
            {({ close }) => (
                <>
                    <Menu.Button aria-label='Hamburger Menu'>
                        <Burger className='h-8 w-8' />
                    </Menu.Button>

                    <Menu.Items
                        as='div'
                        className={classNames(
                            'typography-body-1 fixed inset-x-0 bottom-0 z-50 flex h-screen w-full flex-col gap-4 bg-universeBlue p-8 text-neutral-4'
                        )}
                    >
                        <Closable onClose={close}>
                            <div className='fixed'>
                                <SFLogoSmall className='h-7 w-7' />
                            </div>
                            <div className='w-full flex-col items-start'>
                                {links.map(link => (
                                    <MenuItemLink
                                        key={link.label}
                                        text={link.label}
                                        link={link.link}
                                    />
                                ))}

                                <MenuItemLink text='More' link='#' />
                                {showMore && (
                                    <div className='w-full px-4'>
                                        {EXTRA_LINKS.map(link => (
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
                </>
            )}
        </Menu>
    );
};
