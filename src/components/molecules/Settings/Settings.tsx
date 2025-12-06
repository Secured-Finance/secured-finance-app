import { Popover, Transition } from '@headlessui/react';
import { Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Gear from 'src/assets/icons/gear.svg';
import { Toggle } from 'src/components/atoms';
import { updateTestnetEnabled } from 'src/store/blockchain';
import { RootState } from 'src/store/types';
import { getAnalogousChain, getSupportedChainIds } from 'src/utils';
import { useAccount } from 'wagmi';

export const Settings = ({ isProduction }: { isProduction: boolean }) => {
    const dispatch = useDispatch();
    const chainId = useSelector((state: RootState) => state.blockchain.chainId);
    const testnetEnabled = useSelector(
        (state: RootState) => state.blockchain.testnetEnabled
    );
    const { connector } = useAccount();

    const handleChange = useCallback(async () => {
        const newState = !testnetEnabled;

        if (chainId && connector?.switchChain) {
            const supportedChainIds = getSupportedChainIds();
            const targetChain = getAnalogousChain(
                chainId,
                newState,
                supportedChainIds
            );

            try {
                await connector.switchChain(targetChain.id);
                dispatch(updateTestnetEnabled(newState));
            } catch (error) {
                console.error('Failed to switch chain:', error);
            }
        }
    }, [chainId, connector, dispatch, testnetEnabled]);

    return (
        <Popover className='relative w-fit'>
            {() => (
                <>
                    <Popover.Button
                        data-cy='settings-button'
                        aria-label='Settings Button'
                        className='flex items-center rounded-lg bg-neutral-800 p-[7px] ring-1 ring-neutral-500 focus:outline-none tablet:rounded-xl tablet:p-[11px] tablet:ring-[1.5px]'
                    >
                        <Gear className='h-18px w-18px' />
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
                            <div className='relative flex h-fit flex-col overflow-hidden rounded-xl bg-neutral-700 py-[10px]'>
                                <div className='border-b border-neutral-600 py-2 pl-5'>
                                    <span className='typography-caption-2 text-neutral-300'>
                                        Global Settings
                                    </span>
                                </div>
                                <div className='flex flex-row items-center justify-between px-5 py-3'>
                                    <span className='typography-nav-menu-default leading-[22px] text-neutral-50'>
                                        Testnet mode
                                    </span>
                                    <Toggle
                                        checked={testnetEnabled}
                                        disabled={!isProduction}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};
