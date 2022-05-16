import ethLogo from '../assets/coins/eth.png';
import filLogo from '../assets/coins/fil.png';
import { getCurrencyBy } from './currencyList';

describe('getCurrencyBy', () => {
    const eth = {
        indexCcy: 0,
        icon: ethLogo,
        shortName: 'ETH',
        fullName: 'Ethereum',
        chainId: 60,
    };

    const fil = {
        indexCcy: 1,
        icon: filLogo,
        shortName: 'FIL',
        fullName: 'Filecoin',
        chainId: 461,
    };

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
        expect(getCurrencyBy('fullName', 'Terra Luna')).toBeUndefined();
    });

    it('should return the currency object for existing shortName', () => {
        expect(getCurrencyBy('shortName', 'ETH')).toEqual(eth);
        expect(getCurrencyBy('shortName', 'FIL')).toEqual(fil);
    });

    it('should return the currency object for existing fullName', () => {
        expect(getCurrencyBy('fullName', 'Ethereum')).toEqual(eth);
        expect(getCurrencyBy('fullName', 'Filecoin')).toEqual(fil);
    });

    it('should not be case sensitive for the value', () => {
        expect(getCurrencyBy('fullName', 'ethereUm')).toEqual(eth);
        expect(getCurrencyBy('shortName', 'eth')).toEqual(eth);
        expect(getCurrencyBy('shortName', 'fIL')).toEqual(fil);
    });

    it('should return the chainId for a shortName', () => {
        expect(getCurrencyBy('shortName', 'ETH').chainId).toEqual(eth.chainId);
        expect(getCurrencyBy('shortName', 'FIL').chainId).toEqual(fil.chainId);
        expect(getCurrencyBy('shortName', 'USDC').chainId).toEqual(60);
    });
});
