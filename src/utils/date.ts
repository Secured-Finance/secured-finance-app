import { FINANCIAL_CONSTANTS } from '../config/constants';
import { TimestampConverter } from './timestampConverter';

export function isPastDate(utcTimestamp: number): boolean {
    return utcTimestamp <= Date.now() / FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD;
}

export interface CountdownFormat {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
}

export function countdown(targetTimestamp: number): string {
    // Format the countdown string'
    const count = getCountdown(targetTimestamp);
    if (!count) {
        return '';
    }
    const { days, hours, minutes, seconds } = count;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export const getCountdown = (targetTimestamp: number) => {
    // Convert current time to UTC timestamp
    const now = Date.now();
    const nowUtc = Date.UTC(
        new Date(now).getUTCFullYear(),
        new Date(now).getUTCMonth(),
        new Date(now).getUTCDate(),
        new Date(now).getUTCHours(),
        new Date(now).getUTCMinutes(),
        new Date(now).getUTCSeconds(),
        new Date(now).getUTCMilliseconds()
    );

    // Calculate difference between current time and target time
    const difference = targetTimestamp - nowUtc;

    if (difference <= 0) {
        return undefined;
    }

    // Calculate days, hours, minutes, and seconds remaining
    const days = Math.floor(difference / 86400000);
    const hours = Math.floor((difference % 86400000) / 3600000);
    const minutes = Math.floor((difference % 3600000) / 60000);
    const seconds = Math.floor(
        (difference % 60000) / FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD
    );

    return {
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
    };
};

export const getTimestampRelativeToNow = (hours: number, isFuture = false) => {
    const now = new Date();
    const offset = isFuture ? 1 : -1;
    const adjustedTimestamp = new Date(
        now.getTime() +
            offset * hours * 60 * 60 * FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD
    );
    return Math.floor(
        adjustedTimestamp.getTime() / FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD
    );
};

export const calculateTimeDifference = (timestamp: number) => {
    return TimestampConverter.calculateTimeDifference(timestamp);
};

export const isMaturityPastDays = (
    maturity: number,
    days: number,
    inFuture = false
) => {
    const timeDiff = calculateTimeDifference(maturity);
    const millisecondsInDays =
        days * 24 * 60 * 60 * FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD;

    return inFuture
        ? Math.abs(timeDiff) > millisecondsInDays
        : timeDiff > millisecondsInDays;
};
