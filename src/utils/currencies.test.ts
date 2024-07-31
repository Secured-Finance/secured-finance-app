import { WalletSource as Source } from '@secured-finance/sf-client';
import {
    COIN_GECKO_SOURCE,
    generateWalletInformation,
    generateWalletSourceInformation,
    handlePriceSource,
    WalletSource,
} from './currencies';
import { currencyMap, CurrencySymbol } from './currencyList';

describe('currencies.generateWalletInformation', () => {
    it('should return walletInformation as AssetDisclosureProps', () => {
        const addressRecord = {
            [WalletSource.METAMASK]: 'ethAccount',
            [WalletSource.UTILWALLET]: 'filAccount',
        };

        const balanceRecord = {
            [CurrencySymbol.ETH]: 0.58,
            [CurrencySymbol.USDC]: 150,
        };

        const options = generateWalletInformation(
            addressRecord,
            balanceRecord,
            {
                [WalletSource.METAMASK]: [
                    CurrencySymbol.WBTC,
                    CurrencySymbol.ETH,
                    CurrencySymbol.WFIL,
                    CurrencySymbol.USDC,
                ],
            }
        );
        expect(options).toHaveLength(1);
        expect(options[0]).toEqual({
            account: 'ethAccount',
            walletSource: WalletSource.METAMASK,
            data: [
                {
                    asset: CurrencySymbol.WBTC,
                    quantity: 0,
                },
                {
                    asset: CurrencySymbol.ETH,
                    quantity: 0.58,
                },
                {
                    asset: CurrencySymbol.WFIL,
                    quantity: 0,
                },
                {
                    asset: CurrencySymbol.USDC,
                    quantity: 150,
                },
            ],
        });
    });
});

describe('currencies.generateWalletSourceInformation', () => {
    it('should return walletSourceInformation as WalletSourceOption', () => {
        const options = generateWalletSourceInformation(
            CurrencySymbol.USDC,
            1000,
            BigInt(500000000)
        );
        expect(options).toHaveLength(2);
        expect(options[0].source).toEqual(Source.METAMASK);
        expect(options[1].source).toEqual(Source.SF_VAULT);
        expect(options[0].available).toEqual(1000);
        expect(options[1].available).toEqual(500);
    });
});

describe('currencies.handlePriceSource', () => {
    it('should return CoinGecko price source specific to currency provided', () => {
        const source = handlePriceSource(CurrencySymbol.USDC);

        expect(source).toEqual(
            COIN_GECKO_SOURCE.concat(
                currencyMap[CurrencySymbol.USDC].coinGeckoId
            )
        );
    });
});
