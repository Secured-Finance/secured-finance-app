import { Menu, Transition } from '@headlessui/react';
import { ArrowUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import Link from 'next/link';
import { HTMLAttributes, LegacyRef, forwardRef, useState } from 'react';
import Burger from 'src/assets/img/burger.svg';
import SFLogoSmall from 'src/assets/img/small-logo.svg';
import { Closable } from 'src/components/templates';
import { LinkList } from 'src/utils';
import { UrlObject } from 'url';

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
                    className={classNames(
                        'flex h-16 w-full items-center justify-start whitespace-nowrap px-9 py-4 text-center',
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
                        'flex h-16 w-full flex-row items-center justify-start gap-3 whitespace-nowrap p-4 text-center',
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
                        className={classNames(
                            'mt-1 h-4 w-4 rotate-45 text-white',
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
    const [showMore, setShowMore] = useState(false);

    return (
        <Menu>
            {({ close }) => (
                <>
                    <Menu.Button aria-label='Hamburger Menu'>
                        <Burger className='h-6 w-6 tablet:h-8 tablet:w-8' />
                    </Menu.Button>
                    <Transition
                        className='fixed inset-0 z-50'
                        enter='transition duration-100 ease-out'
                        enterFrom='transform scale-95 opacity-0'
                        enterTo='transform scale-100 opacity-100'
                        leave='transition duration-75 ease-out'
                        leaveFrom='transform scale-100 opacity-100'
                        leaveTo='transform scale-95 opacity-0'
                    >
                        <Menu.Items
                            as='div'
                            className={classNames(
                                'typography-body-1 flex h-screen w-full flex-col gap-4 overflow-y-auto bg-neutral-900 p-8 text-neutral-4'
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

                                    <Menu.Item as='div' className='w-full'>
                                        {({ active }) => (
                                            <button
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setShowMore(!showMore);
                                                }}
                                                aria-label='Show More'
                                                className={classNames(
                                                    'flex h-16 w-full items-center justify-between px-9 py-4 text-center focus:outline-none',
                                                    {
                                                        'border-l-4 border-starBlue bg-gradient-to-r from-[#6A76B159] via-[#4A5BAF1F] to-[#394DAE00] text-neutral-8':
                                                            active,
                                                    }
                                                )}
                                            >
                                                More
                                                <ChevronDownIcon
                                                    className={classNames(
                                                        'mt-2 inline h-6 w-6 text-neutral-4',
                                                        {
                                                            'rotate-180':
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
