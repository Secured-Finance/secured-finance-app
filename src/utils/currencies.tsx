import { AssetDisclosureProps } from 'src/components/molecules';
import { CurrencySymbol } from './currencyList';

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
    [WalletSource.METAMASK]: [CurrencySymbol.ETH, CurrencySymbol.USDC],
};

export const collateralList = [
    CurrencySymbol.ETH,
    CurrencySymbol.USDC,
] as Array<CurrencySymbol>;

export const generateWalletInformation = (
    accounts: Partial<Record<WalletSource, string>>,
    balance: Record<string, number>
): AssetDisclosureProps[] => {
    const collateralRecords = [];
    const walletsArray = Object.keys(walletInformation) as WalletSource[];
    for (let i = 0; i < walletsArray.length; i++) {
        const wallet = walletsArray[i];
        const account = accounts[wallet];
        const data = [];
        if (account) {
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
                account: account,
            });
        }
    }
    return collateralRecords;
};

export const COLLATERAL_THRESHOLD = 74; // in percentage %
export const LIQUIDATION_THRESHOLD = 80; // in percentage %
