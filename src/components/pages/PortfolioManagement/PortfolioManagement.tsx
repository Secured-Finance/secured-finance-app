import {
    AssetDisclosureProps,
    PortfolioManagementTable,
} from 'src/components/molecules';
import {
    CollateralOrganism,
    ConnectWalletCard,
    MyWalletCard,
} from 'src/components/organisms';
import { CurrencySymbol } from 'src/utils';
import { useWallet } from 'use-wallet';

export const PortfolioManagement = () => {
    const { account } = useWallet();
    const assetMap: AssetDisclosureProps[] = [
        {
            data: [
                { asset: CurrencySymbol.ETH, quantity: 1.2 },
                { asset: CurrencySymbol.USDC, quantity: 100 },
            ],
            walletSource: 'metamask',
            account: 'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f',
        },
        {
            data: [{ asset: CurrencySymbol.FIL, quantity: 1.2 }],
            walletSource: 'ledger',
            account: 'de926db3012af759b4f24b5',
        },
    ];

    return (
        <div className='mx-40 mt-7' data-cy='portfolio-management'>
            <div className='typography-portfolio-heading flex h-12 w-fit items-center text-white'>
                Portfolio Management
            </div>
            <div className='flex flex-row justify-between gap-6 pt-4'>
                <div className='flex flex-grow flex-col gap-6'>
                    <PortfolioManagementTable />
                    <CollateralOrganism />
                </div>
                <div className='w-[350px]'>
                    {account ? (
                        <MyWalletCard assetMap={assetMap} />
                    ) : (
                        <ConnectWalletCard />
                    )}
                </div>
            </div>
        </div>
    );
};
