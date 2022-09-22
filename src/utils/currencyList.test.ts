import { BigNumber } from 'ethers';
import {
    currencyMap,
    CurrencySymbol,
    getCurrencyMapAsList,
    getCurrencyMapAsOptions,
    toCurrency,
} from './currencyList';

const fil = currencyMap.FIL;
const eth = currencyMap.ETH;
const wbtc = currencyMap.BTC;

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
                value: 'BTC',
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
        expect(options[currencyMap.BTC.index]).toEqual(currencyMap.BTC);
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

    it('should return the value in satoshi for BTC', () => {
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
            fil.fromBaseUnit(BigNumber.from('1000000000000000000')).toString()
        ).toEqual('1');
        expect(
            fil.fromBaseUnit(BigNumber.from('1230000000000000000')).toString()
        ).toEqual('1.23');
        expect(
            fil.fromBaseUnit(BigNumber.from('1234567890000000000')).toString()
        ).toEqual('1.23456789');
        expect(
            fil.fromBaseUnit(BigNumber.from('10000000000')).toString()
        ).toEqual('1e-8');
        expect(fil.fromBaseUnit(BigNumber.from('1000000')).toString()).toEqual(
            '1e-12'
        );
    });

    it('should return the value in BTC for satoshi amount', () => {
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
        expect(toCurrency(CurrencySymbol.FIL)).toEqual(
            currencyMap.FIL.toCurrency()
        );
    });
});
