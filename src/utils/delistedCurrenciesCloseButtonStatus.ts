import { CurrencySymbol } from 'src/utils/currencyList';

const DELISTED_CURRENCIES_KEY = 'DELISTED_CURRENCIES_KEY';

export function writeDelistedCurrencyClosedStatus(
    currencies: CurrencySymbol[]
) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(DELISTED_CURRENCIES_KEY, currencies.join());
    }
}

export function readDelistedCurrencyClosedStatus(): string | undefined {
    const wallet =
        typeof window !== 'undefined'
            ? localStorage.getItem(DELISTED_CURRENCIES_KEY)
            : undefined;
    return wallet ?? undefined;
}

export function removeDelistedCurrencyClosedStatus() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(DELISTED_CURRENCIES_KEY);
    }
}
