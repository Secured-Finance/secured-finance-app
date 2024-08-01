import { CurrencySymbol } from 'src/utils';

export const useLastPricesPerMarket = (
    maturity: number,
    currency?: CurrencySymbol,
    chainId?: number
) => {
    const key = `${currency}-${maturity}-${chainId}`;

    const lastPrice = localStorage.getItem(key);

    const updateLastPricesPerMarket = (
        lastPrice: number,
        timestamp: number
    ) => {
        const storeValue = { lastPrice, timestamp };
        localStorage.setItem(key, JSON.stringify(storeValue));
    };

    return {
        data: lastPrice ? JSON.parse(lastPrice) : undefined,
        updateLastPricesPerMarket,
    };
};
