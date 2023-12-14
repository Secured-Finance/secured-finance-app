import { WalletSource as Source } from '@secured-finance/sf-client';
import SFLogoSmall from 'src/assets/img/logo-small.svg';
import MetamaskIcon from 'src/assets/img/metamask-fox.svg';
import { WalletSourceOption } from 'src/components/atoms';
import { AssetDisclosureProps } from 'src/components/molecules';
import { amountFormatterFromBase, CurrencySymbol } from './currencyList';

export enum WalletSource {
    METAMASK = 'METAMASK',
    UTILWALLET = 'UTILWALLET',
}

export type CollateralInfo = {
    symbol: CurrencySymbol;
    name: string;
    available: number;
};

export const generateWalletInformation = (
    accounts: Partial<Record<WalletSource, string>>,
    balance: Record<string, number>,
    information: Partial<Record<WalletSource, CurrencySymbol[]>>
): AssetDisclosureProps[] => {
    const collateralRecords = [];
    const walletConfiguration = information;
    const walletsArray = Object.keys(walletConfiguration) as WalletSource[];
    for (let i = 0; i < walletsArray.length; i++) {
        const wallet = walletsArray[i];
        const account = accounts[wallet];
        const data = [];
        if (account) {
            const currenciesArray = walletConfiguration[wallet];
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
                account: account,
            });
        }
    }
    return collateralRecords;
};

export const generateWalletSourceInformation = (
    asset: CurrencySymbol,
    metamaskBalance: number,
    vaultBalance?: bigint
): WalletSourceOption[] => {
    return [
        {
            source: Source.METAMASK,
            available: metamaskBalance,
            asset: asset,
            iconSVG: MetamaskIcon,
        },
        {
            source: Source.SF_VAULT,
            available: vaultBalance
                ? amountFormatterFromBase[asset](vaultBalance)
                : 0,
            asset: asset,
            iconSVG: SFLogoSmall,
        },
    ];
};

// NOTE: Here are the user counts for previous versions of the app
// till Sepolia v0.0.9: 19446
export const PREVIOUS_TOTAL_USERS = 19446;
export const COIN_GECKO_SOURCE = 'https://www.coingecko.com/en/coins/';
