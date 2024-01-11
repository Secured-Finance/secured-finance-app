import { Popover, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { Fragment, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Arbitrum from 'src/assets/icons/arbitrum-network.svg';
import Ethereum from 'src/assets/icons/ethereum-network.svg';
import ExclamationCircleIcon from 'src/assets/icons/exclamation-circle.svg';
import { ExpandIndicator, Separator } from 'src/components/atoms';
import { Networks } from 'src/store/blockchain';
import { RootState } from 'src/store/types';
import { formatDataCy } from 'src/utils';
import { useSwitchNetwork } from 'wagmi';

type ChainInformation = {
    chain: string;
    chainId: number;
    icon: React.ReactNode;
};

const MainnetChainsList: ChainInformation[] = [
    {
        chain: 'Ethereum',
        chainId: 1,
        icon: (
            <Ethereum className='h-4 w-4 rounded-full tablet:h-5 tablet:w-5' />
        ),
    },
    {
        chain: 'Arbitrum',
        chainId: 42161,
        icon: (
            <Arbitrum className='h-4 w-4 rounded-full tablet:h-5 tablet:w-5' />
        ),
    },
];

const TestnetChainsList: ChainInformation[] = [
    {
        chain: 'Sepolia',
        chainId: 11155111,
        icon: (
            <Ethereum className='h-4 w-4 rounded-full tablet:h-5 tablet:w-5' />
        ),
    },
    {
        chain: 'Arbitrum Sepolia',
        chainId: 421614,
        icon: (
            <Arbitrum className='h-4 w-4 rounded-full tablet:h-5 tablet:w-5' />
        ),
    },
];

const MenuItem = ({
    text,
    icon,
    onClick,
}: {
    text: string;
    icon: React.ReactNode;
    onClick?: () => void;
}) => {
    return (
        <button
            data-cy={formatDataCy(text)}
            className={classNames(
                'flex w-full rounded px-3 py-2 transition duration-150 ease-in-out hover:bg-neutral-700 focus:outline-none'
            )}
            onClick={onClick}
        >
            <div className='flex w-full cursor-pointer items-center gap-2'>
                <div className='h-5 w-5'>{icon}</div>
                <p className='typography-button-2 leading-[22px] text-neutral-50'>
                    {text}
                </p>
            </div>
        </button>
    );
};

export const NetworkSelector = ({ networkName }: { networkName: string }) => {
    const { testnetEnabled } = useSelector(
        (state: RootState) => state.blockchain
    );
    const chainList = testnetEnabled ? TestnetChainsList : MainnetChainsList;
    const { switchNetwork } = useSwitchNetwork();
    const selectedNetwork = chainList.find(
        d => Networks[d.chainId] === networkName
    );

    const handleNetworkChange = useCallback(
        (index: number) => {
            const id = chainList[index].chainId;
            switchNetwork?.(id);
        },
        [chainList, switchNetwork]
    );

    return (
        <Popover className='relative'>
            {({ open }) => (
                <>
                    <Popover.Button
                        data-cy='network-selector-button'
                        aria-label='Network Selector Button'
                        className={classNames(
                            'flex items-center gap-2 rounded-[6px] bg-neutral-800 px-3 py-2 ring-[1.5px] ring-neutral-500 focus:outline-none tablet:rounded-xl tablet:px-4 tablet:py-3'
                        )}
                    >
                        {selectedNetwork ? (
                            <div>{selectedNetwork.icon}</div>
                        ) : (
                            <>
                                <span>
                                    <ExclamationCircleIcon className='h-4 w-4 tablet:h-5 tablet:w-5' />
                                </span>
                                <span className='typography-button-2 leading-4 text-neutral-50 tablet:leading-[22px]'>
                                    Network
                                </span>
                                <span className='hidden tablet:inline'>
                                    <ExpandIndicator
                                        expanded={open}
                                        variant='solid'
                                    />
                                </span>
                            </>
                        )}
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
                        <Popover.Panel className='absolute left-0 z-10 mt-3 w-64 origin-top-right tablet:right-0'>
                            <div className='relative flex h-fit flex-col overflow-hidden rounded-xl bg-neutral-900 py-[10px]'>
                                <div className='flex items-center justify-between border-b border-neutral-700 py-[11px] pl-5 pr-4'>
                                    <div className='flex flex-row items-center gap-2'>
                                        {selectedNetwork ? (
                                            <>
                                                <div>
                                                    {selectedNetwork.icon}
                                                </div>
                                                <span className='typography-button-2 leading-[22px] text-neutral-50'>
                                                    {selectedNetwork.chain}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span>
                                                    <ExclamationCircleIcon className='h-5 w-5' />
                                                </span>
                                                <span className='typography-button-2 leading-[22px] text-neutral-50'>
                                                    Network
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <span>
                                        <ExpandIndicator
                                            expanded={open}
                                            variant='solid'
                                        />
                                    </span>
                                </div>
                                <div className='pt-[6px]'>
                                    {chainList.map((link, index) => {
                                        return (
                                            <div key={index} role='menuitem'>
                                                <div className='px-2'>
                                                    <MenuItem
                                                        text={link.chain}
                                                        icon={link.icon}
                                                        onClick={() =>
                                                            handleNetworkChange(
                                                                index
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {index !==
                                                    chainList.length - 1 && (
                                                    <div className='py-[6px]'>
                                                        <Separator />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};
