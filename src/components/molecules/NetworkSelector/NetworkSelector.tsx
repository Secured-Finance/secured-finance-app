import { Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import ExclamationCircleIcon from 'src/assets/icons/exclamation-circle.svg';
import { Separator } from 'src/components/atoms';
import { Networks } from 'src/store/blockchain';
import { RootState } from 'src/store/types';
import {
    SupportedChainsList,
    formatDataCy,
    getSupportedChainIds,
    readWalletFromStore,
} from 'src/utils';
import { useConnect } from 'wagmi';

type ChainInfo = {
    chainName: string;
    chainId: number;
    icon: React.ReactNode;
};

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
            className={clsx(
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

const generateChainList = () => {
    const supportedChainIds = getSupportedChainIds();
    const testnetChainsList: ChainInfo[] = [];
    const mainnetChainsList: ChainInfo[] = [];
    SupportedChainsList.forEach(c => {
        if (supportedChainIds.includes(c.chain.id)) {
            const chainInfo: ChainInfo = {
                chainName: c.chain.name,
                chainId: c.chain.id,
                icon: c.icon,
            };
            // NOTE: 314_159 is a testnet chain id but `viem` does not have a testnet flag for it.
            // So we are checking for the chain id to determine if it is a testnet chain.
            if (c.chain.testnet || c.chain.id === 314_159) {
                testnetChainsList.push(chainInfo);
            } else {
                mainnetChainsList.push(chainInfo);
            }
        }
    });

    return {
        testnetChainsList,
        mainnetChainsList,
    };
};

export const NetworkSelector = ({ networkName }: { networkName: string }) => {
    const testnetEnabled = useSelector(
        (state: RootState) => state.blockchain.testnetEnabled
    );
    const availableChains = useMemo(() => generateChainList(), []);
    const chainList = testnetEnabled
        ? availableChains.testnetChainsList
        : availableChains.mainnetChainsList;

    const selectedNetwork = chainList.find(
        d => Networks[d.chainId].toLowerCase() === networkName.toLowerCase()
    );
    const { connectors } = useConnect();

    const handleNetworkChange = useCallback(
        async (index: number) => {
            const id = chainList[index].chainId;
            const provider = readWalletFromStore();
            const connector = connectors.find(
                connect => connect.name === provider
            );
            if (!connector) {
                return;
            }
            await connector.switchChain?.(id);
        },
        [chainList, connectors]
    );

    return (
        <Popover className='relative'>
            <Popover.Button
                data-cy='network-selector-button'
                aria-label='Network Selector Button'
                className={clsx(
                    'flex items-center gap-2 rounded-lg bg-neutral-800 p-2 ring-1 ring-neutral-500 focus:outline-none tablet:rounded-xl tablet:p-2.5 tablet:ring-[1.5px]',
                    {
                        'pr-2': !selectedNetwork,
                    }
                )}
            >
                {selectedNetwork ? (
                    <div>{selectedNetwork.icon}</div>
                ) : (
                    <ExclamationCircleIcon
                        data-testid='exclamation-circle-icon'
                        className='h-4 w-4 tablet:h-5 tablet:w-5'
                    />
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
                    {({ close }) => (
                        <div className='relative flex h-fit flex-col overflow-hidden rounded-xl bg-neutral-900 py-[10px]'>
                            {chainList.map((link, index) => {
                                return (
                                    <div key={index} role='menuitem'>
                                        <div className='px-2'>
                                            <MenuItem
                                                text={link.chainName}
                                                icon={link.icon}
                                                onClick={async () => {
                                                    await handleNetworkChange(
                                                        index
                                                    );
                                                    close();
                                                }}
                                            />
                                        </div>
                                        {index !== chainList.length - 1 && (
                                            <div className='py-[6px]'>
                                                <Separator />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Popover.Panel>
            </Transition>
        </Popover>
    );
};
