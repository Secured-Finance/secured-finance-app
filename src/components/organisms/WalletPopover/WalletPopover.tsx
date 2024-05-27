import { reset as resetTracking } from '@amplitude/analytics-browser';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AlertTriangle from 'src/assets/icons/alert-triangle.svg';
import MetamaskLogo from 'src/assets/img/metamask-fox.svg';
import { Separator, SupportedNetworks } from 'src/components/atoms';
import { Tooltip } from 'src/components/templates';
import { RootState } from 'src/store/types';
import { resetWallet } from 'src/store/wallet';
import { formatDataCy, removeWalletFromStore } from 'src/utils';
import { useAccount, useDisconnect } from 'wagmi';

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
            className={clsx(
                'flex w-full rounded-md p-2 transition duration-150 ease-in-out focus:outline-none',
                {
                    'hover:bg-horizonBlue': onClick,
                    'flex-col': label,
                }
            )}
        >
            {label && (
                <span className='typography-dropdown-selection-label pb-1 text-slateGray'>
                    {label}
                </span>
            )}
            <button
                aria-label='Menu Item'
                onClick={onClick}
                className={clsx(
                    'flex flex-row items-center justify-start space-x-2',
                    {
                        'cursor-default': !onClick,
                    }
                )}
            >
                <div className='flex h-10 w-10 items-center justify-center'>
                    {icon}
                </div>

                <p className='typography-caption flex capitalize text-grayScale'>
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
    const { disconnect, reset } = useDisconnect();
    const { isConnected } = useAccount();
    const dispatch = useDispatch();
    const chainError = useSelector(
        (state: RootState) => state.blockchain.chainError
    );

    const handleSignOutClick = useCallback(() => {
        if (!isConnected) return;
        resetTracking();
        reset();
        disconnect();
        dispatch(resetWallet());
        removeWalletFromStore();
    }, [disconnect, dispatch, reset, isConnected]);

    return (
        <Popover className='relative max-w-sm'>
            {({ open }) => (
                <>
                    <Popover.Button
                        data-cy='popover-button'
                        aria-label='Wallet Popover Button'
                        className={clsx(
                            'flex items-center gap-x-1 rounded-lg bg-neutral-800 py-2 pl-2 pr-1 ring-1 hover:bg-white-10 hover:ring-white-10 focus:outline-none tablet:gap-x-1.5 tablet:rounded-xl tablet:px-4 tablet:py-3 tablet:pl-3 tablet:pr-2 tablet:ring-[1.5px]',
                            {
                                'bg-white-10 ring-white-10': open,
                                'ring-neutral-500': !open,
                            }
                        )}
                    >
                        <span>
                            <MetamaskLogo className='h-3.5 w-3.5 tablet:h-4 tablet:w-4' />
                        </span>
                        <span
                            className='typography-mobile-body-6 tablet:typography-desktop-body-5 text-grayScale'
                            data-cy='wallet-address'
                        >
                            {wallet}
                        </span>
                        <ChevronDownIcon
                            className={clsx(
                                'h-3.5 w-3.5 text-neutral-400 laptop:h-4 laptop:w-4',
                                {
                                    'rotate-180': open,
                                }
                            )}
                        />
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
                        <Popover.Panel className='absolute right-0 z-10 mt-3 w-64 origin-top-right'>
                            <div className='relative flex flex-col space-y-2 overflow-hidden rounded-xl border border-black bg-neutral-900 p-2 text-white shadow-dropdown'>
                                <MenuItem
                                    label='Network'
                                    text={networkName}
                                    icon={
                                        chainError ? (
                                            <Tooltip
                                                align='right'
                                                iconElement={
                                                    <AlertTriangle data-testid='network-alert-triangle' />
                                                }
                                            >
                                                <SupportedNetworks />
                                            </Tooltip>
                                        ) : (
                                            <div className='h-2 w-2 rounded-full bg-green' />
                                        )
                                    }
                                />
                                <Separator />
                                <MenuItem
                                    text='Disconnect Wallet'
                                    onClick={handleSignOutClick}
                                    icon={
                                        <ArrowLeftOnRectangleIcon className='h-5 w-5 text-slateGray' />
                                    }
                                />
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};
