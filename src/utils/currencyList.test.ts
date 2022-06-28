import { currencyList, getCurrencyBy } from './currencyList';

describe('getCurrencyBy', () => {
    const eth = currencyList[0];
    const fil = currencyList[1];

    it('should return the currency object for an existing string indexCcy', () => {
        expect(getCurrencyBy('indexCcy', '0')).toEqual(eth);
        expect(getCurrencyBy('indexCcy', '1')).toEqual(fil);
    });

    it('should return the currency object for an existing number indexCcy', () => {
        expect(getCurrencyBy('indexCcy', 0)).toEqual(eth);
        expect(getCurrencyBy('indexCcy', 1)).toEqual(fil);

        expect(getCurrencyBy('shortName', 'ETH').indexCcy).toEqual(0);
        expect(getCurrencyBy('shortName', 'FIL').indexCcy).toEqual(1);
        expect(getCurrencyBy('shortName', 'USDC').indexCcy).toEqual(2);
    });

    it('should be undefined for non existing indexCcy', () => {
        expect(getCurrencyBy('indexCcy', 3)).toBeUndefined();
        expect(getCurrencyBy('shortName', 'XXX')).toBeUndefined();
        expect(getCurrencyBy('name', 'Terra Luna')).toBeUndefined();
    });

    it('should return the currency object for existing shortName', () => {
        expect(getCurrencyBy('shortName', 'ETH')).toEqual(eth);
        expect(getCurrencyBy('shortName', 'FIL')).toEqual(fil);
    });

    it('should return the currency object for existing name', () => {
        expect(getCurrencyBy('name', 'Ethereum')).toEqual(eth);
        expect(getCurrencyBy('name', 'Filecoin')).toEqual(fil);
    });

    it('should not be case sensitive for the value', () => {
        expect(getCurrencyBy('name', 'ethereUm')).toEqual(eth);
        expect(getCurrencyBy('shortName', 'eth')).toEqual(eth);
        expect(getCurrencyBy('shortName', 'fIL')).toEqual(fil);
    });

    it('should return the chainId for a shortName', () => {
        expect(getCurrencyBy('shortName', 'ETH').chainId).toEqual(eth.chainId);
        expect(getCurrencyBy('shortName', 'FIL').chainId).toEqual(fil.chainId);
        expect(getCurrencyBy('shortName', 'USDC').chainId).toEqual(60);
    });
});
