const PERCENTAGE_BASE = 100;
export class PriceFormatter {
    static formatUSD(
        number: number | bigint,
        price: number | bigint,
        digits = 0,
        notation: 'standard' | 'compact' = 'standard'
    ): string {
        const num = typeof number === 'bigint' ? Number(number) : number;
        const priceNum = typeof price === 'bigint' ? Number(price) : price;

        return Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            currencySign: 'accounting',
            maximumFractionDigits: digits,
            notation: notation,
        }).format(num * priceNum);
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
            notation: notation,
        }).format(value);
    }

    static formatPercentage(
        number: number,
        unit: 'raw' | 'percentage' = 'percentage',
        minimumFractionDigits = 0,
        maximumFractionDigits = 2
    ): string {
        const divisor = unit === 'percentage' ? PERCENTAGE_BASE : 1;
        const value = number / divisor;
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

    static formatPrice(
        price: number,
        unit: 'raw' | 'percentage' = 'percentage',
        decimals = 2
    ): string {
        const divisor = unit === 'percentage' ? PERCENTAGE_BASE : 1;
        return (price / divisor).toFixed(decimals);
    }

    static formatRate(rate: number, decimals = 2): string {
        return rate.toFixed(decimals) + '%';
    }
}
