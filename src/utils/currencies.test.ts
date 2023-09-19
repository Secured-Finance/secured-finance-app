import { WalletSource as Source } from '@secured-finance/sf-client';
import { BigNumber } from 'ethers';
import {
    generateWalletInformation,
    generateWalletSourceInformation,
    WalletSource,
} from './currencies';
import { CurrencySymbol } from './currencyList';

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

        const options = generateWalletInformation(addressRecord, balanceRecord);
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
            BigNumber.from(500000000)
        );
        expect(options).toHaveLength(2);
        expect(options[0].source).toEqual(Source.METAMASK);
        expect(options[1].source).toEqual(Source.SF_VAULT);
        expect(options[0].available).toEqual(1000);
        expect(options[1].available).toEqual(500);
    });
});
