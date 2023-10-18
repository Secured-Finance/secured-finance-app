import { getCurrencyMapAsOptions } from './assets';

describe('currencyList.getCurrencyMapAsOptions', () => {
    it('should return the currencyList as a list of Option for the ComboBox', () => {
        const options = getCurrencyMapAsOptions();
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
