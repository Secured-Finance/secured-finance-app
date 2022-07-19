import {
    currencyMap,
    getCurrencyByIndex,
    getCurrencyMapAsList,
    getCurrencyMapAsOptions,
} from './currencyList';

describe('getCurrencyBy', () => {
    const eth = currencyMap.ETH;
    const fil = currencyMap.FIL;

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

describe('currencyList.getCurrencyMapAsOptions', () => {
    it('should return the getCurrencyMapAsOptions as a list', () => {
        const options = getCurrencyMapAsList();
        expect(options).toHaveLength(3);
        expect(options[0]).toEqual(currencyMap.ETH);
        expect(options[1]).toEqual(currencyMap.FIL);
        expect(options[2]).toEqual(currencyMap.USDC);
    });
});

describe('currencyList toBaseUnit', () => {
    const fil = currencyMap.FIL;
    const eth = currencyMap.ETH;
    it('should return the value in wei for ETH', () => {
        expect(eth.toBaseUnit(1).toString()).toEqual('1000000000000000000');
        expect(eth.toBaseUnit(1.23).toString()).toEqual('1230000000000000000');
        expect(eth.toBaseUnit(1.23456789).toString()).toEqual(
            '1234567890000000000'
        );
        expect(eth.toBaseUnit(0.00000001).toString()).toEqual('10000000000');
        expect(eth.toBaseUnit(0.000000000001).toString()).toEqual('1000000');
        expect(eth.toBaseUnit(0.000000000000000001).toString()).toEqual('1');
    });

    it('should return the value in attoFil for FIL', () => {
        expect(fil.toBaseUnit(1).toString()).toEqual('1000000000000000000');
        expect(fil.toBaseUnit(1.23).toString()).toEqual('1230000000000000000');
        expect(fil.toBaseUnit(1.23456789).toString()).toEqual(
            '1234567890000000000'
        );
        expect(fil.toBaseUnit(0.00000001).toString()).toEqual('10000000000');
        expect(fil.toBaseUnit(0.000000000001).toString()).toEqual('1000000');
        expect(fil.toBaseUnit(0.000000000000000001).toString()).toEqual('1');
    });

    it('should return 0 if the input value is inferior to the base blockchain unit', () => {
        expect(fil.toBaseUnit(0.0000000000000000001).toString()).toEqual('0');
        expect(fil.toBaseUnit(0.0000000000000000009).toString()).toEqual('0');
        expect(fil.toBaseUnit(0.000000000000000000001).toString()).toEqual('0');
        expect(eth.toBaseUnit(0.0000000000000000001).toString()).toEqual('0');
        expect(eth.toBaseUnit(0.000000000000000000001).toString()).toEqual('0');
    });
});
