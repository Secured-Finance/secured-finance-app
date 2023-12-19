import { toOptions } from './assets';
import { CurrencySymbol } from './currencyList';

describe('toOptions', () => {
    it('should return the currencyList as a list of Option for the ComboBox', () => {
        const options = toOptions(
            [
                CurrencySymbol.WBTC,
                CurrencySymbol.ETH,
                CurrencySymbol.WFIL,
                CurrencySymbol.USDC,
            ],
            CurrencySymbol.WBTC
        );
        expect(options).toEqual([
            {
                label: 'WBTC',
                value: 'WBTC',
            },
            {
                label: 'ETH',
                value: 'ETH',
            },
            {
                label: 'WFIL',
                value: 'WFIL',
            },
            {
                label: 'USDC',
                value: 'USDC',
            },
        ]);
    });
});
