import {
    currencyMap,
    CurrencySymbol,
    getCurrencyMapAsList,
    getCurrencyMapAsOptions,
    toCurrency,
} from './currencyList';

describe('currencyList.getCurrencyMapAsOptions', () => {
    it('should return the currencyList as a list of Option for the ComboBox', () => {
        const options = getCurrencyMapAsOptions();
        expect(options).toEqual([
            {
                label: 'Filecoin',
                value: 'FIL',
                iconSVG: 'svg',
            },
            {
                label: 'Ethereum',
                value: 'ETH',
                iconSVG: 'svg',
            },
            {
                label: 'USDC',
                value: 'USDC',
                iconSVG: 'svg',
            },
            {
                label: 'Bitcoin',
                value: 'WBTC',
                iconSVG: 'svg',
            },
        ]);
    });
});

describe('currencyList.getCurrencyMapAsOptions', () => {
    it('should return the getCurrencyMapAsOptions as a list ordered by index', () => {
        const options = getCurrencyMapAsList();
        expect(options).toHaveLength(4);

        expect(options[currencyMap.FIL.index]).toEqual(currencyMap.FIL);
        expect(options[currencyMap.ETH.index]).toEqual(currencyMap.ETH);
        expect(options[currencyMap.USDC.index]).toEqual(currencyMap.USDC);
        expect(options[currencyMap.WBTC.index]).toEqual(currencyMap.WBTC);
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

describe('toCurrency', () => {
    it('should convert currency symbol to Currency object', () => {
        expect(toCurrency(CurrencySymbol.ETH)).toEqual(
            currencyMap.ETH.toCurrency()
        );
        expect(toCurrency(CurrencySymbol.FIL)).toEqual(
            currencyMap.FIL.toCurrency()
        );
    });
});
