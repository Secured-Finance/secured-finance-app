import { MAX_COVERAGE } from './collateral';
import { divide } from './currencyList';
import { LoanValue } from './entities';
import { FORMAT_DIGITS, PriceFormatter } from './priceFormatter';

export const formatLoanValue = (
    value: LoanValue | undefined,
    type: 'price' | 'rate',
    decimal = 2
) => {
    if (type === 'price') {
        if (!value) return '--.--';
        return PriceFormatter.formatToFixed(divide(value.price, 100), decimal);
    } else {
        if (!value) return '--.--%';
        return PriceFormatter.formatPercentage(
            value.apr.toNormalizedNumber(),
            'percentage',
            decimal,
            decimal
        );
    }
};

export function formatCollateralRatio(collateral: number) {
    return PriceFormatter.formatPercentage(
        collateral / MAX_COVERAGE,
        'raw',
        FORMAT_DIGITS.NONE
    );
}

export function formatCollateralSnapshotRatio(ratio: number) {
    return PriceFormatter.formatPercentage(ratio / 100, 'percentage');
}

export function formatLiquidationThreshold(thresholdValue: number) {
    return PriceFormatter.formatPercentage(thresholdValue, 'percentage');
}

export const formatDuration = (durationMs: number) => {
    const msPerDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
    const daysInYear = 365.25; // Average number of days in a year accounting for leap years

    // Calculate the duration in days
    const durationInDays = durationMs / msPerDay;

    // Calculate the fraction of the year
    const fractionOfYear = durationInDays / daysInYear;

    // Format the fraction of year to two decimal places
    const fractionOfYearFormatted = PriceFormatter.formatToFixed(
        fractionOfYear,
        FORMAT_DIGITS.PRICE
    );

    const daysLeft = Math.round(durationInDays);

    // Return the formatted string
    return `${fractionOfYearFormatted}Y (${daysLeft} ${
        daysLeft === 1 ? 'day' : 'days'
    })`;
};
