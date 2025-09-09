import { MAX_COVERAGE } from './collateral';
import { divide } from './currencyList';
import { LoanValue } from './entities';
import { formatter } from 'src/utils';
import { calculate } from 'src/utils';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

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
    dividedBy: number = FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR,
    minimumFractionDigits = 0,
    maximumFractionDigits = 2
) => {
    const value = dividedBy !== 0 ? number / dividedBy : 0;
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
    return formatter.ordinary(0, 4)(number);
};

export const formatWithCurrency = (
    number: number | bigint,
    currency: string,
    decimals = 2
) => {
    return `${formatter.ordinary(0, decimals)(number)} ${currency}`;
};

export const formatLoanValue = (
    value: LoanValue | undefined,
    type: 'price' | 'rate',
    decimal = 2
) => {
    if (type === 'price') {
        if (!value) return '--.--';
        return divide(value.price, FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR)
            .toFixed(decimal)
            .toString();
    } else {
        if (!value) return '--.--%';
        return Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: decimal,
            maximumFractionDigits: decimal,
        }).format(value.apr.toNormalizedNumber() / 100);
    }
};

export function formatCollateralRatio(collateral: number) {
    return Intl.NumberFormat('en-US', {
        style: 'percent',
        maximumFractionDigits: 2,
    }).format(collateral / MAX_COVERAGE);
}

export const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD);
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(date);
};

export const formatTimestampDDMMYY = (timestamp: number) => {
    const date = new Date(timestamp * FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD);
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
    const date = new Date(timestamp * FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD);

    const month = new Intl.DateTimeFormat('en-US', {
        month: 'short',
    }).format(date);
    const day = date.getDate();
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-GB', { timeZone: 'UTC' });

    return `${month} ${day}, ${year} ${time}`;
};

export const formatTimeStampWithTimezone = (timestamp: number) => {
    const date = new Date(timestamp * FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD);
    return new Intl.DateTimeFormat('en-GB', {
        timeStyle: 'long',
    }).format(date);
};

export const formatDuration = (durationMs: number) => {
    const msPerDay = 24 * 60 * 60 * FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD; // Milliseconds in a day
    const daysInYear = 365.25; // Average number of days in a year accounting for leap years

    // Calculate the duration in days
    const durationInDays = durationMs / msPerDay;

    // Calculate the fraction of the year
    const fractionOfYear = durationInDays / daysInYear;

    // Format the fraction of year to two decimal places
    const fractionOfYearFormatted = fractionOfYear.toFixed(2);

    const daysLeft = calculate.round(durationInDays);

    // Return the formatted string
    return `${fractionOfYearFormatted}Y (${daysLeft} ${
        daysLeft === 1 ? 'day' : 'days'
    })`;
};
