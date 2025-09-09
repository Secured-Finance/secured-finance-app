import { LoanValue, Maturity } from './entities';
import { FINANCIAL_CONSTANTS } from '../config/constants';

export const calculate = {
    floor: (value: number) => Math.floor(value),
    ceiling: (value: number) => Math.ceil(value),
    ceil: (value: number) => Math.ceil(value),
    round: (value: number) => Math.round(value),
    abs: (value: number) => Math.abs(value),
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
    tradeHistoryDetails: (
        _transactions: unknown[],
        _currency: unknown,
        _maturity: unknown
    ) => ({ max: undefined, min: undefined }),
    currentTimestamp: () => Math.floor(Date.now() / 1000),
    preOrderDays: (_date1: unknown, _date2: unknown) => 7,
    priceSpread: (price1: number, price2: number) => Math.abs(price1 - price2),
    aprSpread: (apr1: number, apr2: number) => Math.abs(apr1 - apr2),
};

export const convert = {
    fromBaseToUSD: (value: number, decimals: number) =>
        value / Math.pow(10, decimals),
    fromUSDToBase: (value: number, decimals: number) =>
        value * Math.pow(10, decimals),
    maturity: (maturity: unknown) =>
        maturity &&
        typeof maturity === 'object' &&
        'toNumber' in maturity &&
        typeof maturity.toNumber === 'function'
            ? maturity.toNumber()
            : maturity,
};

export class UnifiedFormatter {
    private static readonly DEFAULT_LOCALE = 'en-US';
    private static readonly DEFAULT_CURRENCY = 'USD';

    static formatAmount(
        amount: number | bigint,
        minDecimals = 0,
        maxDecimals = 4,
        notation: 'standard' | 'compact' = 'standard'
    ): string {
        return new Intl.NumberFormat(this.DEFAULT_LOCALE, {
            minimumFractionDigits: minDecimals,
            maximumFractionDigits: maxDecimals,
            notation: notation,
        }).format(amount);
    }

    static formatUsd(
        amount: number | bigint,
        digits = 0,
        notation: 'standard' | 'compact' = 'standard'
    ): string {
        return new Intl.NumberFormat(this.DEFAULT_LOCALE, {
            style: 'currency',
            currency: this.DEFAULT_CURRENCY,
            currencySign: 'accounting',
            maximumFractionDigits: digits,
            notation: notation,
        }).format(amount);
    }

    static formatPercentage(
        value: number,
        decimals = 2,
        dividedBy: number = FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR
    ): string {
        // When dividedBy is 1, the value is already a percentage (e.g., 43 for 43%)
        // When dividedBy is PERCENTAGE_DIVISOR (100), the value is in basis points (e.g., 3700 for 37%)
        // Note: Intl.NumberFormat with 'percent' style multiplies by 100, so we need to account for that
        const percentValue =
            dividedBy !== 0
                ? dividedBy === 1
                    ? value / 100
                    : value / dividedBy / 100
                : 0;
        return new Intl.NumberFormat(this.DEFAULT_LOCALE, {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: decimals,
        }).format(percentValue);
    }

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
            return new Intl.NumberFormat(this.DEFAULT_LOCALE, {
                style: 'percent',
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            }).format(value.apr.toNormalizedNumber() / 100);
        }
    }

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

export const formatter = {
    usd: (
        amount: number | bigint,
        digits = 0,
        notation: 'standard' | 'compact' = 'standard'
    ) => UnifiedFormatter.formatUsd(amount, digits, notation),

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

    percentage: (value: number, decimals = 2, dividedBy?: number) =>
        UnifiedFormatter.formatPercentage(value, decimals, dividedBy),

    loanValue:
        (type: 'price' | 'rate', decimals?: number) =>
        (value: LoanValue | undefined) =>
            UnifiedFormatter.formatLoanValue(
                value,
                type,
                decimals || FINANCIAL_CONSTANTS.DEFAULT_DECIMALS
            ),

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

    points: (value: number) => UnifiedFormatter.formatAmount(value, 0, 0),
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
