import ethereum from 'src/assets/coins/eth2.svg';
import FilIcon from 'src/assets/coins/fil.svg';
import { AssetDisclosureProps } from 'src/components/molecules';
import { CurrencyInfo, currencyMap, CurrencySymbol } from './currencyList';

export enum WalletSource {
    METAMASK = 'METAMASK',
    LEDGER = 'LEDGER',
}

export type CollateralInfo = {
    indexCcy: number;
    symbol: CurrencySymbol;
    name: string;
    available: number;
};

export const currencyListDropdown = [
    {
        index: 0,
        icon: ethereum,
        value: 'ETH',
        label: 'ETH',
    },
    {
        index: 1,
        icon: <FilIcon className='h-6 w-6' />,
        value: 'FIL',
        label: 'FIL',
    },
    {
        index: 2,
        value: 'USDC',
        label: 'USDC',
    },
];

export const collateralListDropdown = [
    {
        index: 0,
        icon: ethereum,
        value: 'ETH',
        label: 'ETH',
    },
    {
        index: 2,
        value: 'USDC',
        label: 'USDC',
    },
];

export const walletInformation = [
    {
        walletSource: WalletSource.METAMASK,
        currencies: [CurrencySymbol.ETH],
    },
    {
        walletSource: WalletSource.LEDGER,
        currencies: [CurrencySymbol.FIL],
    },
];

export const collateralList = [currencyMap.ETH] as Array<CurrencyInfo>;

export const generateWalletInformation = (
    accounts: Record<WalletSource, string>,
    balance: Record<string, number>
): AssetDisclosureProps[] => {
    const collateralRecords = [];
    for (let i = 0; i < walletInformation.length; i++) {
        const wallet = walletInformation[i].walletSource;
        const data = [];
        if (accounts[wallet]) {
            const currenciesArray = walletInformation[i].currencies;
            for (let j = 0; j < currenciesArray.length; j++) {
                const asset = currenciesArray[j] as CurrencySymbol;
                data.push({
                    asset: asset,
                    quantity: balance[asset] ? balance[asset] : 0,
                });
            }
            collateralRecords.push({
                data: data,
                walletSource: wallet,
                account: accounts[wallet],
            });
        }
    }
    return collateralRecords;
};
