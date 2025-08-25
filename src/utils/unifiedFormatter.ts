import { LoanValue } from './entities';

export type FormatType = 'display' | 'compact' | 'iso' | 'relative';

export interface FormatterOptions {
    decimals?: number;
    notation?: 'standard' | 'compact';
    locale?: string;
    currency?: string;
}

export interface TimestampFormatterOptions extends FormatterOptions {
    includeTime?: boolean;
    timezone?: string;
    relativeTo?: Date;
}

export interface AmountFormatterOptions extends FormatterOptions {
    showCurrency?: boolean;
    maxDecimals?: number;
    minDecimals?: number;
}

export interface PriceFormatterOptions extends FormatterOptions {
    showSymbol?: boolean;
    type?: 'currency' | 'percentage';
}

export class UnifiedFormatter {
    private static readonly DEFAULT_LOCALE = 'en-US';
    private static readonly DEFAULT_CURRENCY = 'USD';

    static formatTimestamp(
        timestamp: number,
        format: FormatType,
        options: TimestampFormatterOptions = {}
    ): string {
        const date = new Date(timestamp * 1000);
        const locale = options.locale || this.DEFAULT_LOCALE;

        switch (format) {
            case 'display':
                return new Intl.DateTimeFormat(locale, {
                    dateStyle:
                        options.includeTime !== false ? 'short' : 'medium',
                    timeStyle:
                        options.includeTime !== false ? 'short' : undefined,
                    timeZone: options.timezone,
                }).format(date);

            case 'compact':
                return new Intl.DateTimeFormat(locale, {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                    timeZone: options.timezone,
                }).format(date);

            case 'iso':
                return date.toISOString();

            case 'relative':
                return this.formatRelativeTime(
                    date,
                    options.relativeTo || new Date()
                );

            default:
                throw new Error(`Unsupported timestamp format: ${format}`);
        }
    }

    static formatAmount(
        amount: number | bigint,
        format: FormatType,
        options: AmountFormatterOptions = {}
    ): string {
        const locale = options.locale || this.DEFAULT_LOCALE;
        const minDecimals = options.minDecimals ?? 0;
        const maxDecimals = options.maxDecimals ?? 4;

        switch (format) {
            case 'display':
                const displayValue = new Intl.NumberFormat(locale, {
                    minimumFractionDigits: minDecimals,
                    maximumFractionDigits: maxDecimals,
                    notation: options.notation || 'standard',
                }).format(amount);

                return options.showCurrency && options.currency
                    ? `${displayValue} ${options.currency}`
                    : displayValue;

            case 'compact':
                return new Intl.NumberFormat(locale, {
                    notation: 'compact',
                    maximumFractionDigits: 1,
                }).format(amount);

            case 'iso':
                return amount.toString();

            case 'relative':
                return this.formatRelativeAmount(amount);

            default:
                throw new Error(`Unsupported amount format: ${format}`);
        }
    }

    static formatPrice(
        price: number | bigint | LoanValue,
        format: FormatType,
        options: PriceFormatterOptions = {}
    ): string {
        const locale = options.locale || this.DEFAULT_LOCALE;
        const type = options.type || 'currency';

        let value: number;
        if (price instanceof LoanValue) {
            value =
                type === 'percentage'
                    ? price.apr.toNormalizedNumber()
                    : price.price / 100;
        } else {
            value = typeof price === 'bigint' ? Number(price) : price;
        }

        switch (format) {
            case 'display':
                if (type === 'currency') {
                    return new Intl.NumberFormat(locale, {
                        style: 'currency',
                        currency: options.currency || this.DEFAULT_CURRENCY,
                        currencySign: 'accounting',
                        maximumFractionDigits: options.decimals || 2,
                        notation: options.notation || 'standard',
                    }).format(value);
                } else {
                    return new Intl.NumberFormat(locale, {
                        style: 'percent',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: options.decimals || 2,
                    }).format(value / 100);
                }

            case 'compact':
                if (type === 'currency') {
                    return new Intl.NumberFormat(locale, {
                        style: 'currency',
                        currency: options.currency || this.DEFAULT_CURRENCY,
                        notation: 'compact',
                        maximumFractionDigits: 0,
                    }).format(value);
                } else {
                    return new Intl.NumberFormat(locale, {
                        style: 'percent',
                        notation: 'compact',
                        maximumFractionDigits: 1,
                    }).format(value / 100);
                }

            case 'iso':
                return value.toString();

            case 'relative':
                return this.formatRelativePrice(value, type);

            default:
                throw new Error(`Unsupported price format: ${format}`);
        }
    }

    private static formatRelativeTime(date: Date, relativeTo: Date): string {
        const diffMs = date.getTime() - relativeTo.getTime();
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (Math.abs(diffDays) >= 1) {
            return `${diffDays > 0 ? '+' : ''}${diffDays}d`;
        } else if (Math.abs(diffHours) >= 1) {
            return `${diffHours > 0 ? '+' : ''}${diffHours}h`;
        } else if (Math.abs(diffMinutes) >= 1) {
            return `${diffMinutes > 0 ? '+' : ''}${diffMinutes}m`;
        } else {
            return 'now';
        }
    }

    private static formatRelativeAmount(amount: number | bigint): string {
        const numAmount = typeof amount === 'bigint' ? Number(amount) : amount;
        const absAmount = Math.abs(numAmount);

        if (absAmount >= 1_000_000_000) {
            return `${(numAmount / 1_000_000_000).toFixed(1)}B`;
        } else if (absAmount >= 1_000_000) {
            return `${(numAmount / 1_000_000).toFixed(1)}M`;
        } else if (absAmount >= 1_000) {
            return `${(numAmount / 1_000).toFixed(1)}K`;
        } else {
            return numAmount.toString();
        }
    }

    private static formatRelativePrice(
        value: number,
        type: 'currency' | 'percentage'
    ): string {
        if (type === 'percentage') {
            const percentage = value;
            if (Math.abs(percentage) >= 100) {
                return `${percentage > 0 ? '+' : ''}${Math.round(percentage)}%`;
            } else {
                return `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;
            }
        } else {
            return this.formatRelativeAmount(value);
        }
    }

    static createSelector<T>(
        formatter: (
            value: T,
            format: FormatType,
            options?: FormatterOptions
        ) => string,
        format: FormatType,
        options?: FormatterOptions
    ) {
        return (value: T) =>
            formatter.call(UnifiedFormatter, value, format, options);
    }
}

export const formatters = {
    timestamp: UnifiedFormatter.formatTimestamp,
    amount: UnifiedFormatter.formatAmount,
    price: UnifiedFormatter.formatPrice,
} as const;

export const selectors = {
    displayTimestamp: (options?: TimestampFormatterOptions) =>
        UnifiedFormatter.createSelector(
            UnifiedFormatter.formatTimestamp,
            'display',
            options
        ),
    compactTimestamp: (options?: TimestampFormatterOptions) =>
        UnifiedFormatter.createSelector(
            UnifiedFormatter.formatTimestamp,
            'compact',
            options
        ),
    isoTimestamp: (options?: TimestampFormatterOptions) =>
        UnifiedFormatter.createSelector(
            UnifiedFormatter.formatTimestamp,
            'iso',
            options
        ),
    relativeTimestamp: (options?: TimestampFormatterOptions) =>
        UnifiedFormatter.createSelector(
            UnifiedFormatter.formatTimestamp,
            'relative',
            options
        ),

    displayAmount: (options?: AmountFormatterOptions) =>
        UnifiedFormatter.createSelector(
            UnifiedFormatter.formatAmount,
            'display',
            options
        ),
    compactAmount: (options?: AmountFormatterOptions) =>
        UnifiedFormatter.createSelector(
            UnifiedFormatter.formatAmount,
            'compact',
            options
        ),
    isoAmount: (options?: AmountFormatterOptions) =>
        UnifiedFormatter.createSelector(
            UnifiedFormatter.formatAmount,
            'iso',
            options
        ),
    relativeAmount: (options?: AmountFormatterOptions) =>
        UnifiedFormatter.createSelector(
            UnifiedFormatter.formatAmount,
            'relative',
            options
        ),

    displayPrice: (options?: PriceFormatterOptions) =>
        UnifiedFormatter.createSelector(
            UnifiedFormatter.formatPrice,
            'display',
            options
        ),
    compactPrice: (options?: PriceFormatterOptions) =>
        UnifiedFormatter.createSelector(
            UnifiedFormatter.formatPrice,
            'compact',
            options
        ),
    isoPrice: (options?: PriceFormatterOptions) =>
        UnifiedFormatter.createSelector(
            UnifiedFormatter.formatPrice,
            'iso',
            options
        ),
    relativePrice: (options?: PriceFormatterOptions) =>
        UnifiedFormatter.createSelector(
            UnifiedFormatter.formatPrice,
            'relative',
            options
        ),
} as const;
