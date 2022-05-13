import ethLogo from '../assets/coins/eth.png';
import filLogo from '../assets/coins/fil.png';
import { getCurrencyBy, getCurrencyIndexFromCurrency } from './currencyList';

describe('getCurrencyIndexFromCurrency', () => {
    it('should return the correct indexCcy for each currency', () => {
        expect(getCurrencyIndexFromCurrency('ETH')).toEqual(0);
        expect(getCurrencyIndexFromCurrency('FIL')).toEqual(1);
        expect(getCurrencyIndexFromCurrency('USDC')).toEqual(2);
    });

    it('should not case sensitive', () => {
        expect(getCurrencyIndexFromCurrency('eth')).toEqual(
            getCurrencyIndexFromCurrency('EtH')
        );
        expect(getCurrencyIndexFromCurrency('fil')).toEqual(
            getCurrencyIndexFromCurrency('FIl')
        );
        expect(getCurrencyIndexFromCurrency('usdc')).toEqual(
            getCurrencyIndexFromCurrency('uSDc')
        );
    });

    it('should return -1 if the currency is not found', () => {
        expect(getCurrencyIndexFromCurrency('XXX')).toEqual(-1);
    });
});

describe('getCurrencyBy', () => {
    const eth = {
        index: 0,
        icon: ethLogo,
        shortName: 'ETH',
        fullName: 'Ethereum',
    };

    const fil = {
        index: 1,
        icon: filLogo,
        shortName: 'FIL',
        fullName: 'Filecoin',
    };

    it('should return the currency object for existing index', () => {
        expect(getCurrencyBy('index', '0')).toEqual(eth);
        expect(getCurrencyBy('index', '1')).toEqual(fil);
    });

    it('should be undefined for non existing index', () => {
        expect(getCurrencyBy('index', '3')).toBeUndefined();
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
});
