import { getCurrencyIndexFromCurrency } from './currencyList';

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
