import { Popover, Transition } from '@headlessui/react';
import { LogoutIcon, UserIcon } from '@heroicons/react/outline';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import React, { Fragment, SVGProps, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FilecoinWallet from 'src/assets/icons/FilecoinWallet.svg';
import MetamaskLogo from 'src/assets/img/metamask-fox.svg';
import { ExpandIndicator, Separator, Toggle } from 'src/components/atoms';
import { CACHED_PROVIDER_KEY } from 'src/contexts/SecuredFinanceProvider/SecuredFinanceProvider';
import { RootState } from 'src/store/types';
import { resetEthWallet } from 'src/store/wallets';
import { isAnyWalletConnected } from 'src/store/wallets/selectors';
import { useWallet } from 'use-wallet';

const Item = ({
    name,
    Icon,
    href,
    Badge,
    onClick,
}: {
    name: string;
    Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    href?: string;
    Badge?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    onClick?: () => void;
}) => {
    const Tag = href ? 'a' : 'button';
    const props: {
        name: string;
        className: string;
        href?: string;
    } = {
        name: name,
        className:
            'flex flex-row items-center w-full justify-start rounded-md p-2 transition duration-150 ease-in-out hover:bg-horizonBlue space-x-4',
    };
    if (href) {
        props.href = href;
    }

    return (
        <div>
            <Tag {...props} onClick={onClick}>
                <div className='flex h-10 w-10 items-center'>
                    <Icon className='h-6 w-6' />
                </div>
                <div>
                    <p className='text-sm font-medium text-white'>{name}</p>
                </div>
                {Badge && (
                    <div className='pl-8'>
                        <Badge className='h-6 w-6' />
                    </div>
                )}
            </Tag>
        </div>
    );
};

const HeaderItem = ({
    label,
    text,
    Icon,
    href,
}: {
    label: string;
    text: string;
    Icon: React.ReactNode;
    href?: string;
}) => {
    const Tag = href ? 'a' : 'div';
    const args = {
        href,
    };
    return (
        <div>
            <Tag
                {...args}
                className={classNames(
                    'flex·flex-col·justify-start·rounded-md·p-2·transition·duration-150·ease-in-out·focus:outline-none',
                    { 'hover:bg-horizonBlue': href }
                )}
            >
                <span className='pb-1 text-white'>{label}:</span>
                <span className='flex flex-row items-center justify-start space-x-4'>
                    <div className='flex h-10 w-10 items-center justify-center'>
                        {Icon}
                    </div>
                    <span className='typography-caption text-white'>
                        {text}
                    </span>
                </span>
            </Tag>
        </div>
    );
};

export const WalletPopover = ({
    wallet,
    networkName,
    isKYC = false,
}: {
    wallet: string;
    networkName: string;
    isKYC?: boolean;
}) => {
    const { reset } = useWallet();
    const dispatch = useDispatch();
    const history = useHistory();
    const otherWalletConnected = useSelector((state: RootState) =>
        isAnyWalletConnected(state, 'ethereum')
    );

    const handleSignOutClick = useCallback(() => {
        reset();
        dispatch(resetEthWallet());
        localStorage.removeItem(CACHED_PROVIDER_KEY);
        if (!otherWalletConnected) {
            history.push('/');
        }
    }, [dispatch, history, otherWalletConnected, reset]);

    return (
        <div className='w-full max-w-sm px-4'>
            <Popover className='relative'>
                {({ open }) => (
                    <>
                        <Popover.Button
                            className='
                flex items-center space-x-3 rounded-xl bg-transparent p-3 ring ring-black-10 hover:bg-black-10'
                        >
                            <span>
                                <MetamaskLogo className='h-4 w-4' />
                            </span>
                            <span className='typography-button-2 text-white'>
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
                            <Popover.Panel className='absolute left-4 z-10 mt-3 w-screen max-w-xs -translate-x-1/2'>
                                <div className='overflow-hidden rounded-lg shadow-sm ring-1 ring-red ring-opacity-5'>
                                    <div className='relative flex flex-col space-y-2 bg-universeBlue p-2 text-white'>
                                        <HeaderItem
                                            label='Network'
                                            text={networkName}
                                            Icon={
                                                <div className='h-2 w-2 rounded-full bg-green' />
                                            }
                                        />

                                        <Separator />
                                        <HeaderItem
                                            label='Filecoin Test Program'
                                            text='Add Filecoin Wallet'
                                            Icon={
                                                <FilecoinWallet className='h-8 w-8' />
                                            }
                                            href='https://wallet.filecoin.io/'
                                        />
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
                                            onClick={handleSignOutClick}
                                            Icon={LogoutIcon}
                                        />

                                        <Separator />
                                        <p className='flex flex-row items-center justify-between rounded-md p-2 transition duration-150 ease-in-out hover:bg-horizonBlue'>
                                            <span className=''>Dark Mode</span>
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
