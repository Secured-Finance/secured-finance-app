import { Popover } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { ArrowUpIcon, ChevronDownIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import Link from 'next/link';
import { useState } from 'react';
import Burger from 'src/assets/img/burger.svg';
import SFLogoSmall from 'src/assets/img/small-logo.svg';
import { CloseButton } from 'src/components/atoms';

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

const MobileItemLink = ({
    text,
    link,
    href,
    onClick,
}: {
    text: string;
    link?: string;
    href?: string;
    onClick: () => void;
}) => {
    const url = href ?? '_';
    const extraProps = href ? { target: '_blank', rel: 'noopener' } : {};
    const anchor = (
        <a
            className={classNames(
                'flex h-16 w-full items-center justify-start px-9 py-4 text-center hover:text-neutral-8',
                {
                    'hover:border-l-4 hover:border-starBlue hover:border-transparent hover:bg-gradient-to-r hover:from-[#6A76B159] hover:via-[#4A5BAF1F] hover:to-[#394DAE00]':
                        link,
                    'group flex flex-row items-center gap-3 hover:bg-[#233447]':
                        href,
                }
            )}
            href={url}
            {...extraProps}
            onClick={onClick}
        >
            <p>{text}</p>
            {href && (
                <ArrowUpIcon className='mt-2 hidden h-5 w-5 rotate-45 text-white group-hover:inline' />
            )}
        </a>
    );
    if (link) {
        return (
            <Link href={link} className='flex h-full' passHref>
                {anchor}
            </Link>
        );
    }

    return anchor;
};

const MenuItem = ({
    text,
    href,
    onClick,
}: {
    text: string;
    href: string;
    onClick: () => void;
}) => {
    return (
        <div className='flex items-center'>
            <MobileItemLink text={text} href={href} onClick={onClick} />
            <ArrowUpIcon
                className='hidden h-5 w-5 rotate-45 text-white'
                role='img'
                aria-label='Arrow pointing out of the menu indicating that the link will open in a new tab'
            />
        </div>
    );
};

export const HamburgerMenu = ({
    links,
}: {
    links: { label: string; link: string }[];
}) => {
    const [showMore, setShowMore] = useState(false);
    return (
        <Popover>
            {({ open, close }) => (
                <>
                    <Popover.Button aria-label='Hamburger Menu'>
                        {!open ? (
                            <Burger className='h-8 w-8' />
                        ) : (
                            <XIcon className='h-8 w-8 text-white' />
                        )}
                    </Popover.Button>
                    <Popover.Panel
                        role='navigation'
                        className={classNames(
                            'typography-body-1 fixed inset-x-0 bottom-0 z-50 flex h-screen w-full flex-col gap-4 bg-universeBlue pt-8 text-neutral-4'
                        )}
                    >
                        <div className='flex items-center justify-between px-4'>
                            <SFLogoSmall className='h-7 w-7' />
                            <CloseButton onClick={() => close()} />
                        </div>
                        <div className='w-full flex-col items-start'>
                            {links.map(link => (
                                <MobileItemLink
                                    key={link.label}
                                    text={link.label}
                                    link={link.link}
                                    onClick={() => close()}
                                />
                            ))}
                        </div>
                        <button
                            className='flex h-16 w-full items-center justify-between px-9 py-4 text-center hover:border-l-4 hover:border-starBlue hover:border-transparent hover:bg-gradient-to-r hover:from-[#6A76B159] hover:via-[#4A5BAF1F] hover:to-[#394DAE00] hover:text-neutral-8'
                            onClick={() => setShowMore(!showMore)}
                            aria-label='Show More'
                        >
                            <p
                                className={classNames({
                                    'text-neutral-8': showMore,
                                })}
                            >
                                More
                            </p>
                            <ChevronDownIcon className='h-8 w-8' />
                        </button>
                        {showMore && (
                            <div className='w-full px-4'>
                                {EXTRA_LINKS.map(link => (
                                    <MenuItem
                                        key={link.text}
                                        text={link.text}
                                        href={link.href}
                                        onClick={() => close()}
                                    />
                                ))}
                            </div>
                        )}
                    </Popover.Panel>
                </>
            )}
        </Popover>
    );
};
