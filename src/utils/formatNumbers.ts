import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { MAX_COVERAGE } from './collateral';
import { divide } from './currencyList';
import { LoanValue } from './entities';

dayjs.extend(duration);

export const usdFormat = (
    number: number | bigint,
    digits = 0,
    notation: 'standard' | 'compact' = 'standard'
) => {
    return Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        currencySign: 'accounting',
        maximumFractionDigits: digits,
        notation: notation,
    }).format(number);
};

export const percentFormat = (
    number: number,
    dividedBy = 100,
    minimumFractionDigits = 0,
    maximumFractionDigits = 2
) => {
    const value = dividedBy === 0 ? 0 : number / dividedBy;
    return Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(value);
};

export const ordinaryFormat = (
    number: number | bigint,
    minDecimals = 0,
    maxDecimals = 2,
    notation: 'standard' | 'compact' = 'standard'
) => {
    return Intl.NumberFormat('en-US', {
        minimumFractionDigits: minDecimals,
        maximumFractionDigits: maxDecimals,
        notation: notation,
    }).format(number);
};

export const formatAmount = (number: number | bigint) => {
    return ordinaryFormat(number, 0, 4);
};

export const formatWithCurrency = (
    number: number | bigint,
    currency: string,
    decimals = 2
) => {
    return `${ordinaryFormat(number, 0, decimals)} ${currency}`;
};

export const formatLoanValue = (
    value: LoanValue | undefined,
    type: 'price' | 'rate',
    decimal = 2
) => {
    if (type === 'price') {
        if (!value) return '--.--';
        return divide(value.price, 100).toFixed(decimal).toString();
    } else {
        if (!value) return '--.--%';
        return percentFormat(
            value.apr.toNormalizedNumber(),
            100,
            decimal,
            decimal
        );
    }
};

export function formatCollateralRatio(collateral: number) {
    return percentFormat(collateral, MAX_COVERAGE, 0);
}

export const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(date);
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

const padNumber = (num: number, length: number): string => {
    return num.toString().padStart(length, '0');
};

export const formatRemainingTime = (seconds: number): string => {
    const remainingDuration = dayjs.duration(seconds, 'seconds');
    const months = remainingDuration.months();
    const days = remainingDuration.days() + months * 30; // Convert months to days
    const hours = remainingDuration.hours();
    const minutes = remainingDuration.minutes();
    const secs = remainingDuration.seconds();

    return `${padNumber(days, 2)}:${padNumber(hours, 2)}:${padNumber(
        minutes,
        2
    )}:${padNumber(secs, 2)}`;
};

export const formatDuration = (durationMs: number) => {
    const msPerDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
    const daysInYear = 365.25; // Average number of days in a year accounting for leap years

    // Calculate the duration in days
    const durationInDays = durationMs / msPerDay;

    // Calculate the fraction of the year
    const fractionOfYear = durationInDays / daysInYear;

    // Format the fraction of year to two decimal places
    const fractionOfYearFormatted = fractionOfYear.toFixed(2);

    // Return the formatted string
    return `${fractionOfYearFormatted}Y (${Math.round(durationInDays)} days)`;
};
