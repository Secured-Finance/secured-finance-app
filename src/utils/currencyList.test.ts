import {
    Currency,
    currencyMap,
    getCurrencyByIndex,
    getCurrencyMapAsOptions,
} from './currencyList';

describe('getCurrencyBy', () => {
    const eth = currencyMap[Currency.ETH];
    const fil = currencyMap[Currency.FIL];

    it('should return the currency object for an existing string indexCcy', () => {
        expect(getCurrencyByIndex('0')).toEqual(eth);
        expect(getCurrencyByIndex('1')).toEqual(fil);
    });

    it('should return the currency object for an existing number indexCcy', () => {
        expect(getCurrencyByIndex(0)).toEqual(eth);
        expect(getCurrencyByIndex(1)).toEqual(fil);
    });

    it('should raise an error non existing indexCcy', () => {
        expect(() => getCurrencyByIndex(3)).toThrow();
    });
});

describe('currencyList.getCurrencyMapAsOptions', () => {
    it('should return the currencyList as a list of Option for the ComboBox', () => {
        const options = getCurrencyMapAsOptions();
        expect(options).toEqual([
            {
                label: 'Ethereum',
                value: 'ETH',
                iconSVG: 'svg',
            },
            {
                label: 'Filecoin',
                value: 'FIL',
                iconSVG: 'svg',
            },
            {
                label: 'USDC',
                value: 'USDC',
                iconSVG: 'svg',
            },
        ]);
    });
});

describe('currencyList toBaseUnit', () => {
    it('should return the value in wei for ETH', () => {
        const eth = currencyMap[Currency.ETH];
        expect(eth.toBaseUnit(1).toString()).toEqual('1000000000000000000');
        expect(eth.toBaseUnit(1.23).toString()).toEqual('1230000000000000000');
        expect(eth.toBaseUnit(1.23456789).toString()).toEqual(
            '1234567890000000000'
        );
    });

    it('should return the value in attoFil for FIL', () => {
        const fil = currencyMap[Currency.FIL];
        expect(fil.toBaseUnit(1).toString()).toEqual('1000000000000000000');
        expect(fil.toBaseUnit(1.23).toString()).toEqual('1230000000000000000');
        expect(fil.toBaseUnit(1.23456789).toString()).toEqual(
            '1234567890000000000'
        );
    });
});
