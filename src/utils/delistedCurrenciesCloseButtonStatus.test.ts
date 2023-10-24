import { CurrencySymbol } from 'src/utils/currencyList';
import {
    readDelistedCurrencyClosedStatus,
    removeDelistedCurrencyClosedStatus,
    writeDelistedCurrencyClosedStatus,
} from './delistedCurrenciesCloseButtonStatus';

describe('delistedCurrenciesCloseButtonStatus', () => {
    const DELISTED_CURRENCIES_KEY = 'DELISTED_CURRENCIES_KEY';
    const currencies = [CurrencySymbol.ETH, CurrencySymbol.WFIL];

    beforeEach(() => {
        localStorage.clear();
    });

    describe('writeDelistedCurrencyClosedStatus', () => {
        it('should write the delisted currencies to localStorage', () => {
            writeDelistedCurrencyClosedStatus(currencies);
            expect(localStorage.getItem(DELISTED_CURRENCIES_KEY)).toEqual(
                currencies.join()
            );
        });
    });

    describe('readDelistedCurrencyClosedStatus', () => {
        it('should read the delisted currencies from localStorage', () => {
            localStorage.setItem(DELISTED_CURRENCIES_KEY, currencies.join());
            expect(readDelistedCurrencyClosedStatus()).toEqual(
                currencies.join()
            );
        });

        it('should return undefined if the delisted currencies are not in localStorage', () => {
            expect(readDelistedCurrencyClosedStatus()).toBeUndefined();
        });
    });

    describe('removeDelistedCurrencyClosedStatus', () => {
        it('should remove the delisted currencies from localStorage', () => {
            localStorage.setItem(DELISTED_CURRENCIES_KEY, currencies.join());
            removeDelistedCurrencyClosedStatus();
            expect(localStorage.getItem(DELISTED_CURRENCIES_KEY)).toBeNull();
        });
    });
});
