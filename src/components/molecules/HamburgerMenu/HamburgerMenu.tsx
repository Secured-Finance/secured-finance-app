import { Popover } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import Link from 'next/link';

import Burger from 'src/assets/img/burger.svg';

const MobileItemLink = ({
    text,
    link,
    onClick,
}: {
    text: string;
    link: string;
    onClick: () => void;
}) => {
    return (
        <Link href={link} className='flex h-full' passHref>
            <a
                className='flex h-16 w-full items-center justify-start px-9 py-4 text-center hover:border-l-4 hover:border-horizonBlue hover:border-transparent hover:bg-gradient-to-r hover:from-[#6A76B159]  hover:via-[#4A5BAF1F] hover:to-[#394DAE00] hover:text-neutral-8'
                href='_'
                onClick={onClick}
            >
                <p>{text}</p>
            </a>
        </Link>
    );
};
export const HamburgerMenu = ({
    links,
}: {
    links: { label: string; link: string }[];
}) => {
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
                            'typography-body-1 absolute inset-x-0 inset-y-28 z-50 flex h-screen w-full flex-col items-end bg-universeBlue text-neutral-4'
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
                    </Popover.Panel>
                </>
            )}
        </Popover>
    );
};
