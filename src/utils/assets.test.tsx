import { getCurrencyMapAsOptions } from './assets';
import { CurrencySymbol } from './currencyList';

describe('currencyList.getCurrencyMapAsOptions', () => {
    it('should return the currencyList as a list of Option for the ComboBox', () => {
        const options = getCurrencyMapAsOptions();
        expect(options).toEqual([
            {
                label: 'WBTC',
                value: 'WBTC',
                iconSVG: 'svg',
            },
            {
                label: 'ETH',
                value: 'ETH',
                iconSVG: 'svg',
            },
            {
                label: 'WFIL',
                value: 'WFIL',
                iconSVG: 'svg',
            },
            {
                label: 'USDC',
                value: 'USDC',
                iconSVG: 'svg',
            },
        ]);
    });

    it('sets the chip property for delisted currencies', () => {
        const delistingStatus = {
            [CurrencySymbol.WBTC]: true,
            [CurrencySymbol.ETH]: false,
            [CurrencySymbol.WFIL]: true,
            [CurrencySymbol.USDC]: false,
        };
        const options = getCurrencyMapAsOptions(delistingStatus);
        expect(
            options.find(option => option.value === CurrencySymbol.WBTC)
        ).toHaveProperty('chip');
        expect(
            options.find(option => option.value === CurrencySymbol.ETH)
        ).not.toHaveProperty('chip');
    });
});
