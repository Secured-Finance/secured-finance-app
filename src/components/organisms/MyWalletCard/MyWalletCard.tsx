import { Separator } from 'src/components/atoms';
import {
    AssetDisclosure,
    AssetDisclosureProps,
} from 'src/components/molecules';

interface MyWalletCardProps {
    assetMap: AssetDisclosureProps[];
}

export const MyWalletCard = ({ assetMap }: MyWalletCardProps) => {
    return (
        <div className='h-fit w-full overflow-hidden'>
            <div className='h-1 w-full bg-starBlue'></div>
            <div className='rounded-b-2xl border border-t-0 border-white-10 shadow-tab'>
                <div className='typography-body-2 mx-2 flex h-14 items-center justify-center text-white'>
                    My Wallet
                </div>
                {assetMap.length !== 0 && (
                    <div>
                        <Separator />
                        <div className='px-2 pt-1 pb-6'>
                            {assetMap.map((asset, index) => {
                                return (
                                    <div key={asset.account}>
                                        <AssetDisclosure {...asset} />
                                        {assetMap.length - 1 !== index && (
                                            <div className='mt-2 mb-2'>
                                                <Separator />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
