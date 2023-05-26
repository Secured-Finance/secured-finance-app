import { reset as resetTracking } from '@amplitude/analytics-browser';
import { Popover, Transition } from '@headlessui/react';
import { LogoutIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MetamaskLogo from 'src/assets/img/metamask-fox.svg';
import { ExpandIndicator, Separator, Toggle } from 'src/components/atoms';
import { CACHED_PROVIDER_KEY } from 'src/contexts/SecuredFinanceProvider/SecuredFinanceProvider';
import { RootState } from 'src/store/types';
import { isEthereumWalletConnected, resetEthWallet } from 'src/store/wallet';
import { formatDataCy } from 'src/utils';
import { useWallet } from 'use-wallet';

const MenuItem = ({
    label,
    text,
    icon,
    badge,
    onClick,
}: {
    label?: string;
    text: string;
    icon: React.ReactNode;
    badge?: React.ReactNode;
    onClick?: () => void;
}) => {
    return (
        <div
            data-cy={formatDataCy(text)}
            className={classNames(
                'flex w-full rounded-md p-2 transition duration-150 ease-in-out focus:outline-none',
                {
                    'hover:bg-horizonBlue': onClick,
                    'flex-col': label,
                }
            )}
        >
            {label && (
                <span className='typography-dropdown-selection-label pb-1 text-slateGray'>
                    {label}:
                </span>
            )}
            <button
                aria-label='Menu Item'
                onClick={onClick}
                className={classNames(
                    'flex flex-row items-center justify-start space-x-2',
                    {
                        'cursor-default': !onClick,
                    }
                )}
            >
                <div className='flex h-10 w-10 items-center justify-center'>
                    {icon}
                </div>

                <p className='typography-caption flex capitalize text-white'>
                    {text}
                </p>
                {badge && <div className='pl-8'>{badge}</div>}
            </button>
        </div>
    );
};

export const WalletPopover = ({
    wallet,
    networkName,
}: {
    wallet: string;
    networkName: string;
}) => {
    const { reset } = useWallet();
    const dispatch = useDispatch();
    const router = useRouter();
    const otherWalletConnected = useSelector((state: RootState) =>
        isEthereumWalletConnected(state)
    );

    const handleSignOutClick = useCallback(() => {
        resetTracking();
        reset();
        dispatch(resetEthWallet());
        localStorage.removeItem(CACHED_PROVIDER_KEY);

        if (!otherWalletConnected) {
            router.push('/');
        }
    }, [dispatch, otherWalletConnected, reset, router]);

    return (
        <>
            <div className='w-full max-w-sm px-4'>
                <Popover className='relative'>
                    {({ open }) => (
                        <>
                            <Popover.Button
                                data-cy='popover-button'
                                aria-label='Wallet Popover Button'
                                className={classNames(
                                    'flex items-center space-x-3 rounded-xl bg-transparent p-3 ring ring-neutral hover:bg-neutral',
                                    { 'bg-neutral': open }
                                )}
                            >
                                <span>
                                    <MetamaskLogo className='h-4 w-4' />
                                </span>
                                <span
                                    className='typography-button-2 text-white'
                                    data-cy='wallet-address'
                                >
                                    {wallet}
                                </span>
                                <span>
                                    <ExpandIndicator
                                        expanded={open}
                                        variant='opaque'
                                    />
                                </span>
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter='transition ease-out duration-200'
                                enterFrom='opacity-0 translate-y-5'
                                enterTo='opacity-100 translate-y-0'
                                leave='transition ease-in duration-150'
                                leaveFrom='opacity-100 translate-y-0'
                                leaveTo='opacity-0 translate-y-5'
                            >
                                <Popover.Panel className='absolute left-9 z-10 mt-3 w-64 -translate-x-1/2'>
                                    <div className='overflow-hidden rounded-lg shadow-sm'>
                                        <div className='relative flex flex-col space-y-2 border border-black bg-universeBlue p-2 text-white shadow-dropdown'>
                                            <MenuItem
                                                label='Network'
                                                text={networkName}
                                                icon={
                                                    <div className='h-2 w-2 rounded-full bg-green' />
                                                }
                                            />
                                            <Separator />
                                            <MenuItem
                                                text='Disconnect Wallet'
                                                onClick={handleSignOutClick}
                                                icon={
                                                    <LogoutIcon className='h-5 w-5 text-slateGray' />
                                                }
                                            />
                                            <Separator />
                                            <p className='flex flex-row items-center justify-between rounded-md p-2 transition duration-150 ease-in-out hover:bg-horizonBlue'>
                                                <span className=''>
                                                    Dark Mode
                                                </span>
                                                <span>
                                                    <Toggle disabled />
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
        </>
    );
};
