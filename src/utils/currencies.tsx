import ethereum from 'src/assets/coins/eth2.svg';
import FilIcon from 'src/assets/coins/fil.svg';
import { AssetDisclosureProps } from 'src/components/molecules';
import { CurrencyInfo, currencyMap, CurrencySymbol } from './currencyList';

export enum WalletSource {
    METAMASK = 'METAMASK',
    UTILWALLET = 'UTILWALLET',
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

export const walletInformation: Partial<
    Record<WalletSource, CurrencySymbol[]>
> = {
    [WalletSource.METAMASK]: [CurrencySymbol.ETH],
};

export const collateralList = [currencyMap.ETH] as Array<CurrencyInfo>;

export const generateWalletInformation = (
    accounts: Partial<Record<WalletSource, string>>,
    balance: Record<string, number>
): AssetDisclosureProps[] => {
    const collateralRecords = [];
    const walletsArray = Object.keys(walletInformation) as WalletSource[];
    for (let i = 0; i < walletsArray.length; i++) {
        const wallet = walletsArray[i];
        const data = [];
        if (accounts[wallet]) {
            const currenciesArray = walletInformation[wallet];
            if (!currenciesArray) {
                continue;
            }
            for (let j = 0; j < currenciesArray.length; j++) {
                const asset = currenciesArray[j];
                data.push({
                    asset: asset,
                    quantity: balance[asset] ? balance[asset] : 0,
                });
            }
            collateralRecords.push({
                data: data,
                walletSource: wallet,
                account: accounts[wallet] ?? '',
            });
        }
    }
    return collateralRecords;
};
