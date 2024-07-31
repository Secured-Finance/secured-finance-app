import clsx from 'clsx';
import Link from 'next/link';
import { useMemo } from 'react';
import Filecoin from 'src/assets/coins/fil.svg';
import AxelarFil from 'src/assets/coins/wfil.svg';
import AxelarSquid from 'src/assets/img/squid+axelar.svg';
import {
    Button,
    ButtonSizes,
    GradientBox,
    Separator,
} from 'src/components/atoms';
import {
    AssetDisclosure,
    AssetDisclosureProps,
} from 'src/components/molecules';
import { useBalances } from 'src/hooks';
import {
    CurrencySymbol,
    WalletSource,
    generateWalletInformation,
} from 'src/utils';

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
                    className={clsx('px-[10px]', {
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
                                    <Link href='/bridge'>
                                        <Button size={ButtonSizes.sm}>
                                            Bridge
                                        </Button>
                                    </Link>
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
        </div>
    );
};
