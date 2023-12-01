import { useMemo } from 'react';
import AxelarFil from 'src/assets/coins/axelarfil.svg';
import Filecoin from 'src/assets/coins/fil.svg';
import AxelarLogo from 'src/assets/img/axelar.svg';
import SquidLogo from 'src/assets/img/squid.svg';
import { Button, GradientBox, Separator } from 'src/components/atoms';
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
}: {
    addressRecord: Partial<Record<WalletSource, string>>;
    information?: Partial<Record<WalletSource, CurrencySymbol[]>>;
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
                <div className='px-[10px] pb-6'>
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
                    <div className='rounded border border-white-20 bg-wrap'>
                        <div className='grid grid-rows-2 gap-y-[18px] px-5 pb-5 pt-6'>
                            <div className='flex flex-row items-center justify-between'>
                                <div className='flex flex-row'>
                                    <Filecoin className='h-10 w-10' />
                                    <AxelarFil className='-ml-3 h-10 w-10' />
                                </div>
                                <Button>Bridge</Button>
                            </div>
                            <div className='typography-nav-menu-default flex flex-col gap-4 text-secondary7'>
                                <p className='typography-nav-menu-default text-[13px]'>
                                    Wrap Filecoin to the Ethereum blockchain for
                                    lending or unwrap to native FIL with a
                                    simple and secure transaction process.
                                </p>
                                <div className='flex flex-row items-center gap-2 text-xs'>
                                    <p>Powered by</p>
                                    <SquidLogo className='h-6 w-6 opacity-60' />
                                    <p>+</p>
                                    <AxelarLogo className='h-6 w-6 opacity-60' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </GradientBox>
        </div>
    );
};
