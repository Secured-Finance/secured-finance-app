export const FORMAT_DIGITS = {
    PRICE: 2,
    AMOUNT: 4,
    ZERO: 0,
    ONE: 1,
    ASSET_DECIMALS: 6,
    PERCENTAGE_MIN: 0,
    PERCENTAGE_MAX: 2,
    PERCENTAGE_BASE: 100,
    BOND_PRICE_MULTIPLIER: 10000,
    MAX_APR_DISPLAY: 1000,
};

export class PriceFormatter {
    static formatUSD(
        amount: string | number | bigint,
        price: string | number | bigint,
        digits = 0,
        notation: 'standard' | 'compact' = 'standard'
    ): string {
        const total = Number(amount) * Number(price);

        return Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            currencySign: 'accounting',
            maximumFractionDigits: digits,
            notation,
        }).format(total);
    }

    static formatUSDValue(
        value: number | bigint,
        digits = 2,
        notation: 'standard' | 'compact' = 'standard'
    ): string {
        return Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            currencySign: 'accounting',
            maximumFractionDigits: digits,
            notation,
        }).format(value);
    }

    static formatPercentage(
        number: number | string,
        unit: 'raw' | 'percentage' = 'percentage',
        minimumFractionDigits = 0,
        maximumFractionDigits = 2
    ): string {
        const divisor =
            unit === 'percentage' ? FORMAT_DIGITS.PERCENTAGE_BASE : 1;
        const value = Number(number) / divisor;
        return Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits,
            maximumFractionDigits,
        }).format(value);
    }

    static formatOrdinary(
        number: number | bigint,
        minDecimals = 0,
        maxDecimals = 2,
        notation: 'standard' | 'compact' = 'standard'
    ): string {
        return Intl.NumberFormat('en-US', {
            minimumFractionDigits: minDecimals,
            maximumFractionDigits: maxDecimals,
            notation: notation,
        }).format(number);
    }

    static formatAmount(number: number | bigint): string {
        return this.formatOrdinary(number, 0, 4);
    }

    static formatWithCurrency(
        number: number | bigint,
        currency: string,
        decimals = 2
    ): string {
        return `${this.formatOrdinary(number, 0, decimals)} ${currency}`;
    }

    static formatToFixed(
        value: number | string | bigint,
        decimals = 2
    ): string {
        const num =
            typeof value === 'string' ? parseFloat(value) : Number(value);
        return num.toFixed(decimals);
    }

    static formatRate(rate: number, decimals = 2): string {
        return rate.toFixed(decimals) + '%';
    }

    /**
     * Format prices from different data sources
     * @param value - Raw price value
     * @param inputType - Source format: 'raw' (0.96), 'percentage' (95.90), 'bondPrice' (9626)
     * @param decimals - Decimal places for output
     * @returns Formatted price string
     */
    static formatPrice(
        value: number,
        inputType: 'raw' | 'percentage' | 'bondPrice' = 'bondPrice',
        decimals = 2
    ): string {
        let normalizedValue: number;

        switch (inputType) {
            case 'raw':
                normalizedValue = value * 100;
                break;
            case 'percentage':
                normalizedValue = value;
                break;
            case 'bondPrice':
                normalizedValue = value / 100;
                break;
            default:
                normalizedValue = value;
        }

        return normalizedValue.toFixed(decimals);
    }
}
