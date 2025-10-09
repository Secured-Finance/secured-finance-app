import {
    convertZCTokenFromBaseAmount,
    PriceFormatter,
    FORMAT_DIGITS,
    CurrencySymbol,
} from 'src/utils';
import { Maturity } from 'src/utils/entities';

/**
 * Utility functions for price and percentage conversions
 * Eliminates component-level mathematical operations
 */
export class PriceUtils {
    /** Convert percentage to decimal (37 → 0.37) */
    static toDecimal(percentage: number): number {
        return percentage / FORMAT_DIGITS.PERCENTAGE_BASE;
    }

    /** Calculate percentage of total (43 of 100 → 43) */
    static toPercentage(part: number, total: number): number {
        return (part / total) * FORMAT_DIGITS.PERCENTAGE_BASE;
    }

    /** Convert price to bond format (0.9626 → 9626) */
    static toBondPrice(price: number): number {
        return price * FORMAT_DIGITS.BOND_PRICE_MULTIPLIER;
    }

    /** Cap APR at maximum display value */
    static capApr(apr: number): number {
        return Math.min(apr, FORMAT_DIGITS.MAX_APR_DISPLAY);
    }

    /** Cap progress width at 100% */
    static capProgressWidth(value: number): number {
        return Math.min(1, value);
    }

    /** Format ZC Token with conversion and formatting */
    static formatZCToken(
        symbol: CurrencySymbol,
        amount: bigint,
        maturity?: Maturity
    ): string {
        const converted = convertZCTokenFromBaseAmount(
            symbol,
            amount,
            maturity
        );
        return PriceFormatter.formatAmount(converted);
    }
}
