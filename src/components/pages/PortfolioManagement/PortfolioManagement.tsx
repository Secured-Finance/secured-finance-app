import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    AssetDisclosureProps,
    PortfolioManagementTable,
} from 'src/components/molecules';
import {
    CollateralOrganism,
    ConnectWalletCard,
    MyWalletCard,
} from 'src/components/organisms';
import { FIL_ADDRESS } from 'src/services/filecoin';
import { RootState } from 'src/store/types';
import { getFilAddress } from 'src/store/wallets/selectors';
import { CurrencySymbol } from 'src/utils';
import { useWallet } from 'use-wallet';

export const PortfolioManagement = () => {
    const { account } = useWallet();
    const addressFromLocalStorage = localStorage.getItem(FIL_ADDRESS);
    const addressFromStore = useSelector(getFilAddress);
    const address = addressFromLocalStorage || addressFromStore;

    const {
        ethereum: { balance: ethereumBalance },
        filecoin: { balance: filecoinBalance },
    } = useSelector((state: RootState) => state.wallets);

    const assetMap: AssetDisclosureProps[] = useMemo(
        () => [
            {
                data: [
                    { asset: CurrencySymbol.ETH, quantity: ethereumBalance },
                ],
                walletSource: 'metamask',
                account: account ? account : '',
            },
            {
                data: [
                    { asset: CurrencySymbol.FIL, quantity: filecoinBalance },
                ],
                walletSource: 'ledger',
                account: address,
            },
        ],
        [account, address, ethereumBalance, filecoinBalance]
    );

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
