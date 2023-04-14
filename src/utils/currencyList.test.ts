import { BigNumber } from 'ethers';
import {
    efilBytes32,
    ethBytes32,
    usdcBytes32,
    wbtcBytes32,
} from 'src/stories/mocks/fixtures';
import {
    CurrencySymbol,
    amountFormatterFromBase,
    amountFormatterToBase,
    currencyMap,
    divide,
    getCurrencyMapAsList,
    getCurrencyMapAsOptions,
    hexToCurrencySymbol,
    multiply,
    toCurrency,
    toCurrencySymbol,
} from './currencyList';

const efil = currencyMap.EFIL;
const eth = currencyMap.ETH;
const wbtc = currencyMap.WBTC;

describe('currencyList.getCurrencyMapAsOptions', () => {
    it('should return the currencyList as a list of Option for the ComboBox', () => {
        const options = getCurrencyMapAsOptions();
        expect(options).toEqual([
            {
                label: 'EFIL',
                value: 'EFIL',
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
                label: 'Wrapped Bitcoin',
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

        expect(options[currencyMap.EFIL.index]).toEqual(currencyMap.EFIL);
        expect(options[currencyMap.ETH.index]).toEqual(currencyMap.ETH);
        expect(options[currencyMap.USDC.index]).toEqual(currencyMap.USDC);
        expect(options[currencyMap.WBTC.index]).toEqual(currencyMap.WBTC);
    });
});

describe('currencyList toBaseUnit', () => {
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
        expect(efil.toBaseUnit(1).toString()).toEqual('1000000000000000000');
        expect(efil.toBaseUnit(1.23).toString()).toEqual('1230000000000000000');
        expect(efil.toBaseUnit(1.23456789).toString()).toEqual(
            '1234567890000000000'
        );
        expect(efil.toBaseUnit(0.00000001).toString()).toEqual('10000000000');
        expect(efil.toBaseUnit(0.000000000001).toString()).toEqual('1000000');
        expect(efil.toBaseUnit(0.000000000000000001).toString()).toEqual('1');
    });

    it('should return 0 if the input value is inferior to the base blockchain unit', () => {
        expect(efil.toBaseUnit(0.0000000000000000001).toString()).toEqual('0');
        expect(efil.toBaseUnit(0.0000000000000000009).toString()).toEqual('0');
        expect(efil.toBaseUnit(0.000000000000000000001).toString()).toEqual(
            '0'
        );
        expect(eth.toBaseUnit(0.0000000000000000001).toString()).toEqual('0');
        expect(eth.toBaseUnit(0.000000000000000000001).toString()).toEqual('0');
    });

    it('should return the value in satoshi for WBTC', () => {
        expect(wbtc.toBaseUnit(1).toString()).toEqual('100000000');
        expect(wbtc.toBaseUnit(1.23).toString()).toEqual('123000000');
        expect(wbtc.toBaseUnit(1.23456789).toString()).toEqual('123456789');
        expect(wbtc.toBaseUnit(0.00000001).toString()).toEqual('1');
        expect(wbtc.toBaseUnit(0.000000000001).toString()).toEqual('0');
        expect(wbtc.toBaseUnit(0.000000000000000001).toString()).toEqual('0');
    });
});

describe('currencyList fromBaseUnit', () => {
    it('should return the value in ETH for wei amount', () => {
        expect(
            eth.fromBaseUnit(BigNumber.from('1000000000000000000')).toString()
        ).toEqual('1');
        expect(
            eth.fromBaseUnit(BigNumber.from('1230000000000000000')).toString()
        ).toEqual('1.23');
        expect(
            eth.fromBaseUnit(BigNumber.from('1234567890000000000')).toString()
        ).toEqual('1.23456789');
        expect(
            eth.fromBaseUnit(BigNumber.from('10000000000')).toString()
        ).toEqual('1e-8');
        expect(eth.fromBaseUnit(BigNumber.from('1000000')).toString()).toEqual(
            '1e-12'
        );
    });

    it('should return the value in FIL for attoFil amount', () => {
        expect(
            efil.fromBaseUnit(BigNumber.from('1000000000000000000')).toString()
        ).toEqual('1');
        expect(
            efil.fromBaseUnit(BigNumber.from('1230000000000000000')).toString()
        ).toEqual('1.23');
        expect(
            efil.fromBaseUnit(BigNumber.from('1234567890000000000')).toString()
        ).toEqual('1.23456789');
        expect(
            efil.fromBaseUnit(BigNumber.from('10000000000')).toString()
        ).toEqual('1e-8');
        expect(efil.fromBaseUnit(BigNumber.from('1000000')).toString()).toEqual(
            '1e-12'
        );
    });

    it('should return the value in WBTC for satoshi amount', () => {
        expect(
            wbtc.fromBaseUnit(BigNumber.from('100000000')).toString()
        ).toEqual('1');
        expect(
            wbtc.fromBaseUnit(BigNumber.from('123000000')).toString()
        ).toEqual('1.23');
        expect(
            wbtc.fromBaseUnit(BigNumber.from('123456789')).toString()
        ).toEqual('1.23456789');
        expect(wbtc.fromBaseUnit(BigNumber.from('1')).toString()).toEqual(
            '1e-8'
        );
        expect(wbtc.fromBaseUnit(BigNumber.from('0')).toString()).toEqual('0');
    });
});

describe('toCurrency', () => {
    it('should convert currency symbol to Currency object', () => {
        expect(toCurrency(CurrencySymbol.ETH)).toEqual(
            currencyMap.ETH.toCurrency()
        );
        expect(toCurrency(CurrencySymbol.EFIL)).toEqual(
            currencyMap.EFIL.toCurrency()
        );
    });
});

describe('currencyList amountFormatterToBase', () => {
    it('should return the value in wei for ETH', () => {
        const format = amountFormatterToBase[CurrencySymbol.ETH];
        expect(format(1).toString()).toEqual('1000000000000000000');
        expect(format(1.23).toString()).toEqual('1230000000000000000');
        expect(format(1.23456789).toString()).toEqual('1234567890000000000');
        expect(format(0.00000001).toString()).toEqual('10000000000');
        expect(format(0.000000000001).toString()).toEqual('1000000');
        expect(format(0.000000000000000001).toString()).toEqual('1');
    });

    it('should return the value in attoFil for FIL', () => {
        const format = amountFormatterToBase[CurrencySymbol.EFIL];
        expect(format(1).toString()).toEqual('1000000000000000000');
        expect(format(1.23).toString()).toEqual('1230000000000000000');
        expect(format(1.23456789).toString()).toEqual('1234567890000000000');
        expect(format(0.00000001).toString()).toEqual('10000000000');
        expect(format(0.000000000001).toString()).toEqual('1000000');
        expect(format(0.000000000000000001).toString()).toEqual('1');
    });

    it('should return 0 if the input value is inferior to the base blockchain unit', () => {
        const format = amountFormatterToBase[CurrencySymbol.EFIL];
        expect(format(0.0000000000000000001).toString()).toEqual('0');
        expect(format(0.0000000000000000009).toString()).toEqual('0');
        expect(format(0.000000000000000000001).toString()).toEqual('0');
        expect(format(0.0000000000000000001).toString()).toEqual('0');
        expect(format(0.000000000000000000001).toString()).toEqual('0');
    });

    it('should return the value in satoshi for WBTC', () => {
        const format = amountFormatterToBase[CurrencySymbol.WBTC];
        expect(format(1).toString()).toEqual('100000000');
        expect(format(1.23).toString()).toEqual('123000000');
        expect(format(1.23456789).toString()).toEqual('123456789');
        expect(format(0.00000001).toString()).toEqual('1');
        expect(format(0.000000000001).toString()).toEqual('0');
        expect(format(0.000000000000000001).toString()).toEqual('0');
    });
});

describe('currencyList amountFormatterFromBase', () => {
    it('should return the value in ETH for wei amount', () => {
        const format = amountFormatterFromBase[CurrencySymbol.ETH];
        expect(
            format(BigNumber.from('1000000000000000000000000')).toString()
        ).toEqual('1000000');
        expect(
            format(BigNumber.from('1000000000000000000')).toString()
        ).toEqual('1');
        expect(
            format(BigNumber.from('1230000000000000000')).toString()
        ).toEqual('1.23');
        expect(
            format(BigNumber.from('1234567890000000000')).toString()
        ).toEqual('1.23456789');
        expect(format(BigNumber.from('10000000000')).toString()).toEqual(
            '1e-8'
        );
        expect(format(BigNumber.from('1000000')).toString()).toEqual('1e-12');
    });

    it('should return the value in FIL for attoFil amount', () => {
        const format = amountFormatterFromBase[CurrencySymbol.EFIL];
        expect(
            format(BigNumber.from('1000000000000000000')).toString()
        ).toEqual('1');
        expect(
            format(BigNumber.from('1230000000000000000')).toString()
        ).toEqual('1.23');
        expect(
            format(BigNumber.from('1234567890000000000')).toString()
        ).toEqual('1.23456789');
        expect(format(BigNumber.from('10000000000')).toString()).toEqual(
            '1e-8'
        );
        expect(format(BigNumber.from('1000000')).toString()).toEqual('1e-12');
    });

    it('should return the value in WBTC for satoshi amount', () => {
        const format = amountFormatterFromBase[CurrencySymbol.WBTC];
        expect(format(BigNumber.from('100000000')).toString()).toEqual('1');
        expect(format(BigNumber.from('123000000')).toString()).toEqual('1.23');
        expect(format(BigNumber.from('123456789')).toString()).toEqual(
            '1.23456789'
        );
        expect(format(BigNumber.from('100000000000')).toString()).toEqual(
            '1000'
        );
        expect(format(BigNumber.from('1')).toString()).toEqual('1e-8');
        expect(format(BigNumber.from('0')).toString()).toEqual('0');
    });
});

describe('toCurrencySymbol', () => {
    it('should convert a currency string to a currency symbol', () => {
        expect(toCurrencySymbol('ETH')).toEqual(CurrencySymbol.ETH);
        expect(toCurrencySymbol('EFIL')).toEqual(CurrencySymbol.EFIL);
        expect(toCurrencySymbol('WBTC')).toEqual(CurrencySymbol.WBTC);
        expect(toCurrencySymbol('USDC')).toEqual(CurrencySymbol.USDC);
    });

    it('should return undefined if the currency is not supported', () => {
        expect(toCurrencySymbol('')).toBeUndefined();
        expect(toCurrencySymbol('XRP')).toBeUndefined();
        expect(toCurrencySymbol('EUR')).toBeUndefined();
    });
});

describe('hexToCurrencySymbol', () => {
    it('should convert a hex string to a currency symbol', () => {
        expect(hexToCurrencySymbol(ethBytes32)).toEqual(CurrencySymbol.ETH);
        expect(hexToCurrencySymbol(efilBytes32)).toEqual(CurrencySymbol.EFIL);
        expect(hexToCurrencySymbol(wbtcBytes32)).toEqual(CurrencySymbol.WBTC);
        expect(hexToCurrencySymbol(usdcBytes32)).toEqual(CurrencySymbol.USDC);
    });

    it('should return undefined if the currency is not supported', () => {
        expect(hexToCurrencySymbol('0x585250')).toBeUndefined();
        expect(hexToCurrencySymbol('0x455552')).toBeUndefined();
    });
});

describe('multiple', () => {
    it('should multiply two numbers with precision', () => {
        expect(multiply(80.6, 100)).toEqual(8060);
        expect(multiply(80.612, 99.12345, 4)).toEqual(7990.5396);
    });
});

describe('divide', () => {
    it('should divide two numbers with precision', () => {
        expect(divide(8060, 100)).toEqual(80.6);
        expect(divide(80.612, 99.12345, 4)).toEqual(0.8132);
    });
});
