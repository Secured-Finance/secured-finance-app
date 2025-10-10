import { FINANCIAL_CONSTANTS } from '../config/constants';

/**
 * Percentage unit types for formatting
 */
export const PERCENTAGE_UNIT = {
    RAW: 'raw',
    PERCENTAGE: 'percentage',
} as const;

export type PercentageUnit =
    (typeof PERCENTAGE_UNIT)[keyof typeof PERCENTAGE_UNIT];

/**
 * Core price and number formatting utility
 * All formatting operations should use this class for consistency
 */
export class PriceFormatter {
    /**
     * Format amount * price as USD currency
     * @param amount - The amount (string, number, or bigint)
     * @param price - The price per unit (string, number, or bigint)
     * @param digits - Maximum decimal places (default: 0)
     * @param notation - Display notation: 'standard' or 'compact' (default: 'standard')
     * @returns Formatted USD string with currency symbol
     * @example
     * PriceFormatter.formatUSD(100, 1.5, 2) // "$150.00"
     * PriceFormatter.formatUSD(1000000, 1, 0, 'compact') // "$1M"
     */
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

    /**
     * Format a value directly as USD currency
     * @param value - The value to format (number or bigint)
     * @param digits - Maximum decimal places (default: 2)
     * @param notation - Display notation: 'standard' or 'compact' (default: 'standard')
     * @returns Formatted USD string with currency symbol
     * @example
     * PriceFormatter.formatUSDValue(1234.56, 2) // "$1,234.56"
     * PriceFormatter.formatUSDValue(1000000, 0, 'compact') // "$1M"
     */
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

    /**
     * Format a number as a percentage
     * @param number - The number to format (number or string)
     * @param unit - Input unit: 'raw' (0.43 → 43%) or 'percentage' (43 → 43%)
     * @param minimumFractionDigits - Minimum decimal places (default: 0)
     * @param maximumFractionDigits - Maximum decimal places (default: 2)
     * @returns Formatted percentage string
     * @example
     * PriceFormatter.formatPercentage(43, 'percentage', 0, 2) // "43%"
     * PriceFormatter.formatPercentage(0.4321, 'raw', 2, 2) // "43.21%"
     */
    static formatPercentage(
        number: number | string,
        unit: PercentageUnit = PERCENTAGE_UNIT.PERCENTAGE,
        minimumFractionDigits = 0,
        maximumFractionDigits = 2
    ): string {
        const divisor =
            unit === PERCENTAGE_UNIT.PERCENTAGE
                ? FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR
                : 1;
        const value = Number(number) / divisor;
        return Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits,
            maximumFractionDigits,
        }).format(value);
    }

    /**
     * Format a number with specified decimal places
     * @param number - The number to format (number or bigint)
     * @param minDecimals - Minimum decimal places (default: 0)
     * @param maxDecimals - Maximum decimal places (default: 2)
     * @param notation - Display notation: 'standard' or 'compact' (default: 'standard')
     * @returns Formatted number string
     * @example
     * PriceFormatter.formatOrdinary(1234.5, 0, 2) // "1,234.5"
     * PriceFormatter.formatOrdinary(1000000, 0, 2, 'compact') // "1M"
     */
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

    /**
     * Format an amount with default settings (0 min, 4 max decimals)
     * @param number - The amount to format (number or bigint)
     * @returns Formatted amount string
     * @example
     * PriceFormatter.formatAmount(1234.56789) // "1,234.5679"
     */
    static formatAmount(number: number | bigint): string {
        return this.formatOrdinary(number, 0, 4);
    }

    /**
     * Format a number with currency symbol
     * @param number - The number to format (number or bigint)
     * @param currency - The currency symbol (e.g., 'USD', 'ETH')
     * @param decimals - Maximum decimal places (default: 2)
     * @returns Formatted string with currency
     * @example
     * PriceFormatter.formatWithCurrency(1234.56, 'ETH', 4) // "1,234.56 ETH"
     */
    static formatWithCurrency(
        number: number | bigint,
        currency: string,
        decimals = 2
    ): string {
        return `${this.formatOrdinary(number, 0, decimals)} ${currency}`;
    }

    /**
     * Format a value to fixed decimal places
     * @param value - The value to format (number, string, or bigint)
     * @param decimals - Number of decimal places (default: 2)
     * @returns Formatted string with fixed decimals
     * @example
     * PriceFormatter.formatToFixed(1234.56789, 2) // "1234.57"
     */
    static formatToFixed(
        value: number | string | bigint,
        decimals = 2
    ): string {
        const num =
            typeof value === 'string' ? parseFloat(value) : Number(value);
        return num.toFixed(decimals);
    }

    /**
     * Format a rate as percentage with % symbol
     * @param rate - The rate value
     * @param decimals - Number of decimal places (default: 2)
     * @returns Formatted rate string with %
     * @example
     * PriceFormatter.formatRate(3.26, 2) // "3.26%"
     */
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
            case PERCENTAGE_UNIT.RAW:
                normalizedValue =
                    value * FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR;
                break;
            case PERCENTAGE_UNIT.PERCENTAGE:
                normalizedValue = value;
                break;
            case 'bondPrice':
                normalizedValue =
                    value / FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR;
                break;
            default:
                normalizedValue = value;
        }

        return normalizedValue.toFixed(decimals);
    }
}
