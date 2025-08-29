import { MAX_COVERAGE } from './collateral';
import { divide } from './currencyList';
import { LoanValue } from './entities';
import { PriceFormatter } from './priceFormatter';

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
    return PriceFormatter.formatPercentage(collateral / MAX_COVERAGE, 'raw', 0);
}

export const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(date);
};

export const formatTimestampDDMMYY = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    }).format(date);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${formattedDate}, ${hours}:${minutes}`;
};

export const formatTimestampWithMonth = (timestamp: number) => {
    const date = new Date(timestamp * 1000);

    const month = new Intl.DateTimeFormat('en-US', {
        month: 'short',
    }).format(date);
    const day = date.getDate();
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-GB', { timeZone: 'UTC' });

    return `${month} ${day}, ${year} ${time}`;
};

export const formatTimeStampWithTimezone = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('en-GB', {
        timeStyle: 'long',
    }).format(date);
};

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
        2
    );

    const daysLeft = Math.round(durationInDays);

    // Return the formatted string
    return `${fractionOfYearFormatted}Y (${daysLeft} ${
        daysLeft === 1 ? 'day' : 'days'
    })`;
};
