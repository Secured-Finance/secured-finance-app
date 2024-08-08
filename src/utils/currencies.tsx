import { WalletSource as Source } from '@secured-finance/sf-client';
import SFLogoSmall from 'src/assets/img/logo-small.svg';
import MetamaskIcon from 'src/assets/img/metamask-fox.svg';
import { WalletSourceOption } from 'src/components/atoms';
import { AssetDisclosureProps } from 'src/components/molecules';
import { ZERO_BI } from './collateral';
import { currencyMap, CurrencySymbol } from './currencyList';

export enum WalletSource {
    METAMASK = 'METAMASK',
    UTILWALLET = 'UTILWALLET',
}

export type CollateralInfo = {
    symbol: CurrencySymbol;
    name: string;
    available: number;
    availableFullValue: bigint;
};

export const generateWalletInformation = (
    accounts: Partial<Record<WalletSource, string>>,
    balance: Record<string, bigint>,
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
                    quantity: balance[asset] ? balance[asset] : ZERO_BI,
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
    metamaskBalance: bigint,
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
            available: vaultBalance || ZERO_BI,
            asset: asset,
            iconSVG: SFLogoSmall,
        },
    ];
};

// NOTE: Here are the user counts for previous versions of the app
// till Sepolia v0.0.10: 21118
export const PREVIOUS_TOTAL_USERS = 21118;
export const COIN_GECKO_SOURCE = 'https://www.coingecko.com/en/coins/';

export const handlePriceSource = (asset: CurrencySymbol | undefined) =>
    asset && COIN_GECKO_SOURCE.concat(currencyMap[asset].coinGeckoId);
