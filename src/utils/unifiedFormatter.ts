import { LoanValue, Maturity } from './entities';
import { FINANCIAL_CONSTANTS } from '../config/constants';
import { TransactionList } from 'src/types';
import { PriceFormatter } from './priceFormatter';

/**
 * Math calculation utilities for consistent rounding and math operations
 */
export const calculate = {
    /** Floor a number */
    floor: (value: number) => Math.floor(value),
    /** Ceiling a number */
    ceiling: (value: number) => Math.ceil(value),
    /** Ceiling a number (alias) */
    ceil: (value: number) => Math.ceil(value),
    /** Round a number */
    round: (value: number) => Math.round(value),
    /** Absolute value */
    abs: (value: number) => Math.abs(value),
    /** Calculate LoanValue from price and maturity */
    loanValueFromPrice: (
        price: number,
        maturity: number | Maturity,
        calculationDate?: number
    ) =>
        UnifiedFormatter.calculateLoanValueFromPrice(
            price,
            maturity,
            calculationDate
        ),
    /**
     * @deprecated Stub function - not implemented
     * Returns placeholder values for trade history details
     */
    tradeHistoryDetails: (
        _transactions: TransactionList,
        _currency: string,
        _maturity: number | Maturity
    ) => ({ max: undefined, min: undefined }),
    /** Get current timestamp in seconds */
    currentTimestamp: () => Math.floor(Date.now() / 1000),
    /**
     * @deprecated Stub function - returns hardcoded value
     * Should calculate actual pre-order days difference
     */
    preOrderDays: (_date1: Date | number, _date2: Date | number) => 7,
    /** Calculate absolute price spread */
    priceSpread: (price1: number, price2: number) => Math.abs(price1 - price2),
    /** Calculate absolute APR spread */
    aprSpread: (apr1: number, apr2: number) => Math.abs(apr1 - apr2),
};

export const calculateBigInt = {
    abs: (value: bigint) => (value < 0n ? -value : value),
    max: (a: bigint, b: bigint) => (a > b ? a : b),
    min: (a: bigint, b: bigint) => (a < b ? a : b),
    currentTimestamp: () => BigInt(Math.floor(Date.now() / 1000)),
    priceSpread: (price1: bigint, price2: bigint) =>
        calculateBigInt.abs(price1 - price2),
    aprSpread: (apr1: bigint, apr2: bigint) => calculateBigInt.abs(apr1 - apr2),
};

export const convert = {
    fromBaseToUSD: (value: number, decimals: number) =>
        value / Math.pow(10, decimals),
    fromUSDToBase: (value: number, decimals: number) =>
        value * Math.pow(10, decimals),
    maturity: (maturity: Maturity | number | bigint): number =>
        maturity &&
        typeof maturity === 'object' &&
        'toNumber' in maturity &&
        typeof maturity.toNumber === 'function'
            ? maturity.toNumber()
            : Number(maturity),
};

export const convertBigInt = {
    fromBaseToUSD: (value: bigint, decimals: number): bigint => {
        const divisor = BigInt(Math.pow(10, decimals));
        return value / divisor;
    },
    fromUSDToBase: (value: bigint, decimals: number): bigint => {
        const multiplier = BigInt(Math.pow(10, decimals));
        return value * multiplier;
    },
    toBigInt: (value: number | bigint | string | Maturity): bigint => {
        if (typeof value === 'bigint') return value;
        if (typeof value === 'string') return BigInt(value);
        if (
            typeof value === 'object' &&
            value &&
            'toNumber' in value &&
            typeof value.toNumber === 'function'
        ) {
            return BigInt(value.toNumber());
        }
        return BigInt(Math.floor(Number(value)));
    },
    toNumber: (value: bigint): number => Number(value),
    maturity: (maturity: Maturity | number | bigint): bigint =>
        maturity &&
        typeof maturity === 'object' &&
        'toNumber' in maturity &&
        typeof maturity.toNumber === 'function'
            ? BigInt(maturity.toNumber())
            : convertBigInt.toBigInt(maturity),
};

/**
 * Unified formatting utility that consolidates all formatting operations.
 * Uses PriceFormatter internally for consistent formatting across the application.
 */
export class UnifiedFormatter {
    /**
     * Format a numeric amount with specified decimal places
     * @param amount - The amount to format (number or bigint)
     * @param minDecimals - Minimum decimal places (default: 0)
     * @param maxDecimals - Maximum decimal places (default: 4)
     * @param notation - Display notation: 'standard' or 'compact' (default: 'standard')
     * @returns Formatted amount string
     * @example
     * UnifiedFormatter.formatAmount(1234.5, 0, 2) // "1,234.5"
     * UnifiedFormatter.formatAmount(1000000, 0, 2, 'compact') // "1M"
     */
    static formatAmount(
        amount: number | bigint,
        minDecimals = 0,
        maxDecimals = 4,
        notation: 'standard' | 'compact' = 'standard'
    ): string {
        return PriceFormatter.formatOrdinary(
            amount,
            minDecimals,
            maxDecimals,
            notation
        );
    }

    /**
     * Format a numeric value as USD currency
     * @param amount - The amount to format (number or bigint)
     * @param digits - Maximum decimal places (default: 0)
     * @param notation - Display notation: 'standard' or 'compact' (default: 'standard')
     * @returns Formatted USD string with currency symbol
     * @example
     * UnifiedFormatter.formatUSD(1234.56, 2) // "$1,234.56"
     * UnifiedFormatter.formatUSD(1000000, 0, 'compact') // "$1M"
     */
    static formatUSD(
        amount: number | bigint,
        digits = 0,
        notation: 'standard' | 'compact' = 'standard'
    ): string {
        return PriceFormatter.formatUSDValue(amount, digits, notation);
    }

    /**
     * Format a numeric value as a percentage
     * @param value - The value to format
     * @param decimals - Decimal places for the percentage (default: 2)
     * @param dividedBy - Divisor to normalize the value (default: PERCENTAGE_DIVISOR = 100)
     *   - When 1: value is already in raw/decimal form (0.43 → 43%)
     *   - When 100: value is basis points (3700 → 37%)
     * @returns Formatted percentage string
     * @example
     * UnifiedFormatter.formatPercentage(3700, 2, 100) // "37.00%"  (basis points)
     * UnifiedFormatter.formatPercentage(0.43, 2, 1) // "43.00%"  (raw decimal)
     */
    static formatPercentage(
        value: number,
        decimals = 2,
        dividedBy: number = FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR
    ): string {
        // When dividedBy is 1, value is already in raw/decimal form (e.g., 0.43 for 43%)
        // When dividedBy is 100, value is in basis points (e.g., 3700 for 37%, 4300 for 43%)
        // We need to convert to raw form (0.XX) for PriceFormatter
        let normalizedValue: number;

        if (dividedBy === 1) {
            // Value is already in raw form (0.43) → use as-is
            normalizedValue = value;
        } else {
            // Value is basis points (3700) → convert to raw (3700 / 100 / 100 = 0.37)
            normalizedValue =
                value / dividedBy / FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR;
        }

        return PriceFormatter.formatPercentage(
            normalizedValue,
            'raw',
            decimals,
            decimals
        );
    }

    /**
     * Format a LoanValue entity as either price or rate
     * @param value - The LoanValue to format (or undefined)
     * @param type - Format as 'price' or 'rate'
     * @param decimals - Decimal places (default: DEFAULT_DECIMALS)
     * @returns Formatted loan value string or placeholder if undefined
     * @example
     * UnifiedFormatter.formatLoanValue(loanValue, 'price', 2) // "96.85"
     * UnifiedFormatter.formatLoanValue(loanValue, 'rate', 2) // "3.26%"
     * UnifiedFormatter.formatLoanValue(undefined, 'price') // "--.--"
     */
    static formatLoanValue(
        value: LoanValue | undefined,
        type: 'price' | 'rate',
        decimals: number = FINANCIAL_CONSTANTS.DEFAULT_DECIMALS
    ): string {
        if (type === 'price') {
            if (!value) return '--.--';
            const convertedPrice =
                value.price / FINANCIAL_CONSTANTS.PRICE_TO_PERCENTAGE;
            return this.formatAmount(convertedPrice, decimals, decimals);
        } else {
            if (!value) return '--.--%';
            const aprValue =
                value.apr.toNormalizedNumber() /
                FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR;
            return PriceFormatter.formatPercentage(
                aprValue,
                'raw',
                decimals,
                decimals
            );
        }
    }

    /**
     * Calculate a LoanValue from a price and maturity
     * @param price - The bond price
     * @param maturity - The maturity date (timestamp or Maturity object)
     * @param calculationDate - Optional calculation date (default: current time)
     * @returns Calculated LoanValue
     * @example
     * UnifiedFormatter.calculateLoanValueFromPrice(9626, maturity) // LoanValue instance
     */
    static calculateLoanValueFromPrice(
        price: number,
        maturity: number | Maturity,
        calculationDate?: number
    ): LoanValue {
        const maturityNumber = Number(maturity);
        const calculationTimestamp =
            calculationDate || Math.floor(Date.now() / 1000);
        return LoanValue.fromPrice(price, maturityNumber, calculationTimestamp);
    }
}

/**
 * Standard formatter object for consistent formatting across the application
 * This is the recommended way to format values in components
 *
 * @example
 * formatter.usd(1234.56, 2) // "$1,234.56"
 * formatter.ordinary(0, 2)(1234.5) // "1,234.50"
 * formatter.percentage(3700, 2, 100) // "37.00%"
 */
export const formatter = {
    /**
     * Format as USD currency
     * @example formatter.usd(1234.56, 2) // "$1,234.56"
     */
    usd: (
        amount: number | bigint,
        digits = 0,
        notation: 'standard' | 'compact' = 'standard'
    ) => UnifiedFormatter.formatUSD(amount, digits, notation),

    /**
     * Format ordinary number with specified decimal places
     * @example formatter.ordinary(0, 2)(1234.5) // "1,234.50"
     */
    ordinary:
        (
            minDecimals = 0,
            maxDecimals = 2,
            notation: 'standard' | 'compact' = 'standard'
        ) =>
        (amount: number | bigint) =>
            UnifiedFormatter.formatAmount(
                amount,
                minDecimals,
                maxDecimals,
                notation
            ),

    /**
     * Format as percentage
     * @param value - The value to format
     * @param decimals - Decimal places (default: 2)
     * @param dividedBy - When 1: value is raw decimal (0.43), when 100: value is basis points (3700)
     * @example formatter.percentage(3700, 2, 100) // "37.00%" (basis points)
     * @example formatter.percentage(0.43, 2, 1) // "43.00%" (raw decimal)
     */
    percentage: (value: number, decimals = 2, dividedBy?: number) =>
        UnifiedFormatter.formatPercentage(value, decimals, dividedBy),

    /**
     * Format LoanValue as price or rate
     * @example formatter.loanValue('price', 2)(loanValue) // "96.85"
     */
    loanValue:
        (type: 'price' | 'rate', decimals?: number) =>
        (value: LoanValue | undefined) =>
            UnifiedFormatter.formatLoanValue(
                value,
                type,
                decimals || FINANCIAL_CONSTANTS.DEFAULT_DECIMALS
            ),

    /**
     * Calculate and format LoanValue from price
     * @example formatter.loanValueFromPrice('rate', 2)(9626, maturity) // "3.26%"
     */
    loanValueFromPrice:
        (
            type: 'price' | 'rate',
            decimals = FINANCIAL_CONSTANTS.DEFAULT_DECIMALS
        ) =>
        (
            price: number,
            maturity: number | Maturity,
            calculationDate?: number
        ) => {
            const loanValue = UnifiedFormatter.calculateLoanValueFromPrice(
                price,
                maturity,
                calculationDate
            );
            return UnifiedFormatter.formatLoanValue(loanValue, type, decimals);
        },

    /**
     * Format points value (no decimals)
     * @example formatter.points(1234) // "1,234"
     */
    points: (value: number) => UnifiedFormatter.formatAmount(value, 0, 0),

    /**
     * Format price with aggregation factor
     * @example formatter.priceWithAggregation(100, 'price')(value) // formatted value
     */
    priceWithAggregation:
        (_aggregationFactor: number, type: string) =>
        (value: number | LoanValue) => {
            if (typeof value === 'number') {
                return UnifiedFormatter.formatAmount(value, 2, 2);
            } else {
                return UnifiedFormatter.formatLoanValue(
                    value,
                    type as 'price' | 'rate'
                );
            }
        },
};
