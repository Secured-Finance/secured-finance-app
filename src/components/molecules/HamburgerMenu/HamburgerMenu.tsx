import { Popover } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { ArrowUpIcon, ChevronDownIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import Link from 'next/link';
import { useState } from 'react';

import Burger from 'src/assets/img/burger.svg';

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
                        className={classNames(
                            'typography-body-1 absolute inset-x-0 inset-y-28 z-50 flex h-screen w-full flex-col items-start bg-universeBlue text-neutral-4'
                        )}
                    >
                        {links.map(link => (
                            <MobileItemLink
                                key={link.label}
                                text={link.label}
                                link={link.link}
                                onClick={() => close()}
                            />
                        ))}
                        <button
                            className='flex h-16 w-full items-center justify-between px-9 py-4 text-center hover:border-l-4 hover:border-starBlue hover:border-transparent hover:bg-gradient-to-r hover:from-[#6A76B159] hover:via-[#4A5BAF1F] hover:to-[#394DAE00] hover:text-neutral-8'
                            onClick={() => setShowMore(!showMore)}
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
                                <div className='flex items-center'>
                                    <MobileItemLink
                                        text='Secured Finance Landing page'
                                        href='https://secured.finance/'
                                        onClick={() => close()}
                                    />
                                </div>
                                <div className='flex items-center'>
                                    <MobileItemLink
                                        text='Documentation'
                                        href='https://blog.secured.finance/'
                                        onClick={() => close()}
                                    />
                                    <ArrowUpIcon className='hidden h-5 w-5 rotate-45 text-white' />
                                </div>
                                <div className='flex items-center'>
                                    <MobileItemLink
                                        text='Follow us on Twitter'
                                        href='https://twitter.com/Secured_Fi/'
                                        onClick={() => close()}
                                    />
                                    <ArrowUpIcon className='hidden h-5 w-5 rotate-45 text-white' />
                                </div>
                                <div className='flex items-center'>
                                    <MobileItemLink
                                        text='Join us on Discord'
                                        href='https://discord.com/invite/FqrdfQgmjT'
                                        onClick={() => close()}
                                    />
                                    <ArrowUpIcon className='hidden h-5 w-5 rotate-45 text-white' />
                                </div>
                            </div>
                        )}
                    </Popover.Panel>
                </>
            )}
        </Popover>
    );
};
