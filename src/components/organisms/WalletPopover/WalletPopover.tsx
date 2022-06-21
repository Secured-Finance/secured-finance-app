import { Popover, Transition } from '@headlessui/react';
import { LogoutIcon, UserIcon } from '@heroicons/react/outline';
import { BadgeCheckIcon, SupportIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import { Fragment, SVGProps } from 'react';
import metamaskLogo from 'src/assets/img/metamask-fox.svg';
import { Separator } from 'src/components/atoms/Separator/Separator';
import { Toggle } from 'src/components/atoms/Toggle/Toggle';

const Item = ({
    name,
    Icon,
    href,
    Badge,
}: {
    name: string;
    Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    href?: string;
    Badge?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}) => {
    const Tag = href ? 'a' : 'button';
    const props: {
        name: string;
        className: string;
        href?: string;
    } = {
        name: name,
        className:
            'focus:outline-none focus-visible:ring-orange -m-3 flex items-center rounded-md p-2 transition duration-150 ease-in-out hover:bg-starBlue-80 focus-visible:ring focus-visible:ring-opacity-50',
    };
    if (href) {
        props.href = href;
    }

    return (
        <Fragment>
            <Tag {...props}>
                <div className='text-secondary-200 flex h-10 w-10 shrink-0 items-center justify-center'>
                    <Icon aria-hidden='true' className='h-6 w-6' />
                </div>
                <div className='ml-4'>
                    <p className='text-sm font-medium text-white'>{name}</p>
                </div>
                {Badge && (
                    <div className='ml-auto'>
                        <Badge className='h-6 w-6' />
                    </div>
                )}
            </Tag>
        </Fragment>
    );
};

export const WalletPopover = ({
    wallet,
    networkName,
    status = 'connected',
    isKYC = false,
}: {
    wallet: string;
    networkName: string;
    status?: 'connected' | 'disconnected' | 'connecting';
    isKYC?: boolean;
}) => {
    return (
        <div className='fixed top-16 w-full max-w-sm px-4'>
            <Popover className='relative'>
                {({ open }) => (
                    <>
                        <Popover.Button
                            className={`
                ${open ? '' : 'text-opacity-90'}
                focus:outline-none group inline-flex items-center rounded-md bg-universeBlue px-3 py-2 text-base font-medium text-white hover:text-opacity-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                            <span>
                                <img
                                    src={metamaskLogo}
                                    alt={wallet}
                                    className='h-6'
                                />
                            </span>
                            <span className='pl-4'>{wallet}</span>
                        </Popover.Button>
                        <Transition
                            as={Fragment}
                            enter='transition ease-out duration-200'
                            enterFrom='opacity-0 translate-y-1'
                            enterTo='opacity-100 translate-y-0'
                            leave='transition ease-in duration-150'
                            leaveFrom='opacity-100 translate-y-0'
                            leaveTo='opacity-0 translate-y-1'
                        >
                            <Popover.Panel className='absolute left-36 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4'>
                                <div className='overflow-hidden rounded-md shadow-lg ring-1 ring-red ring-opacity-5'>
                                    <div className='relative grid gap-4 bg-universeBlue p-7 text-white'>
                                        <p className='focus:outline-none -m-3 flex flex-col items-start rounded-md p-2 transition duration-150 ease-in-out hover:bg-horizonBlue focus-visible:ring focus-visible:ring-orange focus-visible:ring-opacity-50'>
                                            <span className='ml-2 pb-2 text-sm text-lightGrey'>
                                                Network:
                                            </span>
                                            <span className='flex flex-row items-center'>
                                                <SupportIcon
                                                    className={classNames(
                                                        'mx-2 h-4 w-4',
                                                        {
                                                            'text-green':
                                                                status ===
                                                                'connected',
                                                            'text-red':
                                                                status ===
                                                                'disconnected',
                                                            'text-orange':
                                                                status ===
                                                                'connecting',
                                                        }
                                                    )}
                                                />
                                                <span>{networkName}</span>
                                            </span>
                                        </p>
                                        <Separator />
                                        {isKYC ? (
                                            <Item
                                                name='Account Verified'
                                                Icon={UserIcon}
                                                Badge={BadgeCheckIcon}
                                            />
                                        ) : (
                                            <Item
                                                name='Finish KYC'
                                                Icon={UserIcon}
                                                href='/kyc'
                                            />
                                        )}

                                        <Item
                                            name='Disconnect Wallet'
                                            href='##'
                                            Icon={LogoutIcon}
                                        />

                                        <Separator />
                                        <p className='focus:outline-none -m-3 flex flex-row items-center justify-between rounded-md p-2 transition duration-150 ease-in-out hover:bg-horizonBlue focus-visible:ring focus-visible:ring-orange focus-visible:ring-opacity-50'>
                                            <span className='ml-2'>
                                                Dark Mode
                                            </span>
                                            <span>
                                                <Toggle />
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </div>
    );
};
