import { Menu, Transition } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HTMLAttributes, Ref, forwardRef, useState } from 'react';
import Burger from 'src/assets/img/menu.svg';
import SFLogoSmall from 'src/assets/img/small-logo.svg';
import { CloseButton } from 'src/components/atoms';
import { LinkList } from 'src/utils';
import { UrlObject } from 'url';

const NextLink = forwardRef(
    (
        props: HTMLAttributes<HTMLAnchorElement> & {
            href: string | UrlObject;
            target?: string;
        },
        ref: Ref<HTMLAnchorElement>
    ) => {
        const { href, children, ...rest } = props;
        return (
            <Link href={href} {...rest} ref={ref}>
                {children}
            </Link>
        );
    }
);
NextLink.displayName = 'NextLink';

const MenuItemLink = ({ text, link }: { text: string; link: string }) => {
    const router = useRouter();
    const isActive = router.pathname === link;

    return (
        <Menu.Item>
            {() => (
                <NextLink
                    href={link}
                    className={clsx(
                        'typography-mobile-h-6 flex w-full items-center justify-start whitespace-nowrap px-2 py-1.5 text-center',
                        { underline: isActive }
                    )}
                >
                    {text}
                </NextLink>
            )}
        </Menu.Item>
    );
};

const MobileItemLink = ({
    text,
    href,
    target,
}: {
    text: string;
    href: string;
    target?: string;
}) => {
    const router = useRouter();
    const isActive = router.pathname === href;
    return (
        <Menu.Item>
            <NextLink
                className={clsx(
                    'typography-mobile-h-6 flex w-full flex-row items-center justify-start gap-3 whitespace-nowrap px-3 py-1.5 text-center',
                    { underline: isActive }
                )}
                href={href}
                target={target}
                rel='noreferrer'
            >
                {text}
            </NextLink>
        </Menu.Item>
    );
};

export const HamburgerMenu = ({
    links,
}: {
    links: { label: string; link: string; className?: string }[];
}) => {
    const [showMore, setShowMore] = useState<boolean>(false);

    return (
        <Menu>
            {({ open, close }) => (
                <>
                    <Menu.Button aria-label='Hamburger Menu'>
                        <Burger className='h-6 w-6 text-neutral-400' />
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
                            className='flex h-screen w-full flex-col gap-[26px] overflow-y-auto bg-neutral-900 p-4 text-neutral-4'
                        >
                            <div className='flex items-center justify-between'>
                                <SFLogoSmall className='h-5 w-[22.75px]' />
                                <CloseButton onClick={close} />
                            </div>
                            <div className='w-full flex-col items-start text-primary-50'>
                                {links.map(link => (
                                    <div
                                        key={link.label}
                                        className={link.className}
                                    >
                                        <MenuItemLink
                                            text={link.label}
                                            link={link.link}
                                        />
                                    </div>
                                ))}

                                <Menu.Item
                                    as='div'
                                    className={clsx(
                                        'typography-mobile-h-6 flex w-full items-center'
                                    )}
                                >
                                    {() => (
                                        <button
                                            onClick={e => {
                                                e.preventDefault();
                                                setShowMore(!showMore);
                                            }}
                                            aria-label='Show More'
                                            className={clsx(
                                                'flex items-center justify-between gap-2 px-2 py-2 text-center focus:outline-none'
                                            )}
                                        >
                                            More
                                            <ChevronRightIcon
                                                className={clsx(
                                                    'relative top-[1px] inline h-6 w-6',
                                                    {
                                                        'rotate-90': showMore,
                                                    }
                                                )}
                                            />
                                        </button>
                                    )}
                                </Menu.Item>

                                {showMore && (
                                    <div className='w-full px-4'>
                                        {LinkList.filter(
                                            link => !link.isInternal
                                        ).map(link => (
                                            <MobileItemLink
                                                key={link.text}
                                                text={link.text}
                                                href={link.href}
                                                target='_blank'
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    );
};
