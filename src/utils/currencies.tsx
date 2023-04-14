import { WalletSource as Source } from '@secured-finance/sf-client';
import { BigNumber } from 'ethers';
import SFLogoSmall from 'src/assets/img/logo-small.svg';
import MetamaskIcon from 'src/assets/img/metamask-fox.svg';
import { WalletSourceOption } from 'src/components/atoms';
import { AssetDisclosureProps } from 'src/components/molecules';
import {
    amountFormatterFromBase,
    CurrencySymbol,
    getCurrencyMapAsOptions,
} from './currencyList';

export enum WalletSource {
    METAMASK = 'METAMASK',
    UTILWALLET = 'UTILWALLET',
}

export type CollateralInfo = {
    symbol: CurrencySymbol;
    name: string;
    available: number;
};

export const walletInformation: Partial<
    Record<WalletSource, CurrencySymbol[]>
> = {
    [WalletSource.METAMASK]: getCurrencyMapAsOptions().map(ccy => ccy.value),
};

export const generateWalletInformation = (
    accounts: Partial<Record<WalletSource, string>>,
    balance: Record<string, number>,
    information?: Partial<Record<WalletSource, CurrencySymbol[]>>
): AssetDisclosureProps[] => {
    const collateralRecords = [];
    const walletConfiguration = information ?? walletInformation;
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
    nonCollateralBalance: BigNumber
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
            available: amountFormatterFromBase[asset](nonCollateralBalance),
            asset: asset,
            iconSVG: SFLogoSmall,
        },
    ];
};

export const COLLATERAL_THRESHOLD = 80; // in percentage %
export const LIQUIDATION_THRESHOLD = 80; // in percentage %
export const TOTAL_USERS_V4 = 6824;
