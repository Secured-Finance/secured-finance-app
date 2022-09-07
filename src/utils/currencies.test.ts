import { generateWalletInformation, WalletSource } from './currencies';
import { CurrencySymbol } from './currencyList';

describe('currencies.generateWalletInformation', () => {
    it('should return walletInformation as AssetDisclosureProps', () => {
        const addressRecord = {
            [WalletSource.METAMASK]: 'ethAccount',
            [WalletSource.UTILWALLET]: 'filAccount',
        };

        const balanceRecord = {
            [CurrencySymbol.ETH]: 0.58,
            [CurrencySymbol.FIL]: 150,
        };

        const options = generateWalletInformation(addressRecord, balanceRecord);
        expect(options).toHaveLength(1);
        expect(options[0]).toEqual({
            account: 'ethAccount',
            walletSource: WalletSource.METAMASK,
            data: [
                {
                    asset: CurrencySymbol.ETH,
                    quantity: 0.58,
                },
            ],
        });
    });
});
