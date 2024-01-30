import { Dialog } from '@headlessui/react';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { useMemo, useRef, useState } from 'react';
import Filecoin from 'src/assets/coins/fil.svg';
import AxelarFil from 'src/assets/coins/wfil.svg';
import AxelarSquid from 'src/assets/img/squid+axelar.svg';
import { Button, GradientBox, Separator } from 'src/components/atoms';
import { ButtonSizes } from 'src/components/atoms/Button/types';
import {
    AssetDisclosure,
    AssetDisclosureProps,
} from 'src/components/molecules';
import { useBalances } from 'src/hooks';
import {
    CurrencySymbol,
    WalletSource,
    generateWalletInformation,
    squidConfig,
} from 'src/utils';

const SquidWidget = dynamic(() =>
    import('@0xsquid/widget').then(mod => mod.SquidWidget)
);

const BridgeDialog = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const refDiv = useRef(null); // Dialog needs a focusable element. There are no focus elements in the dialog if its rendered without a button.

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className='relative z-30'
            initialFocus={refDiv}
        >
            <div className='fixed inset-0 bg-backgroundBlur backdrop-blur-sm' />
            <div className='fixed inset-0 flex items-center justify-center'>
                <Dialog.Panel
                    className='h-screen w-full overflow-y-auto rounded-xl bg-universeBlue p-6 shadow-deep tablet:h-fit tablet:w-fit'
                    data-cy='modal'
                >
                    <div
                        ref={refDiv}
                        className='min-h-2/3 flex h-full w-full flex-col items-center justify-between space-y-6 tablet:h-fit tablet:justify-center'
                    >
                        <SquidWidget config={squidConfig} />
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};
export const MyWalletCard = ({
    addressRecord,
    information,
    hideBridge = false,
}: {
    addressRecord: Partial<Record<WalletSource, string>>;
    information: Partial<Record<WalletSource, CurrencySymbol[]>>;
    hideBridge?: boolean;
}) => {
    const balanceRecord = useBalances();
    const [isOpen, setIsOpen] = useState(false);

    const assetMap: AssetDisclosureProps[] = useMemo(
        () =>
            generateWalletInformation(
                addressRecord,
                balanceRecord,
                information
            ),
        [addressRecord, balanceRecord, information]
    );

    return (
        <div className='h-fit w-full bg-transparent'>
            <GradientBox header='My Wallet'>
                <div
                    className={classNames('px-[10px]', {
                        'pb-6': !hideBridge,
                    })}
                >
                    {assetMap.length !== 0 && (
                        <div className='pb-6 pt-1'>
                            {assetMap.map((asset, index) => {
                                return (
                                    <div key={asset.account}>
                                        <AssetDisclosure {...asset} />
                                        {assetMap.length - 1 !== index && (
                                            <div className='mb-2 mt-2'>
                                                <Separator />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {!hideBridge && (
                        <div className='rounded-[3px] border border-white-20'>
                            <div className='grid grid-flow-row gap-y-[18px] rounded-sm bg-wrap px-5 pb-3 pt-5'>
                                <div className='flex flex-row items-start justify-between'>
                                    <div className='flex flex-row'>
                                        <Filecoin className='h-10 w-10' />
                                        <AxelarFil className='-ml-3 h-10 w-10' />
                                    </div>
                                    <Button
                                        onClick={() => setIsOpen(true)}
                                        size={ButtonSizes.xs}
                                    >
                                        Bridge
                                    </Button>
                                </div>
                                <div className='typography-nav-menu-default flex flex-col gap-4 text-secondary7'>
                                    <p className='typography-nav-menu-default text-[13px]'>
                                        Wrap Filecoin to the Ethereum blockchain
                                        for lending or unwrap to native FIL with
                                        a simple and secure transaction process.
                                    </p>
                                    <div className='flex flex-row items-center gap-2 text-xs'>
                                        <p>Powered by</p>
                                        <AxelarSquid className='h-10 w-28 opacity-60' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </GradientBox>
            <BridgeDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
};
