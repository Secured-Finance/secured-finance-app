export function isPastDate(utcTimestamp: number): boolean {
    return utcTimestamp <= Date.now() / 1000;
}

export function countdown(targetTimestamp: number): string {
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
        return '';
    }

    // Calculate days, hours, minutes, and seconds remaining
    const days = Math.floor(difference / 86400000);
    const hours = Math.floor((difference % 86400000) / 3600000);
    const minutes = Math.floor((difference % 3600000) / 60000);
    const seconds = Math.floor((difference % 60000) / 1000);

    // Format the countdown string
    const countdownString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    return countdownString;
}

const millisecondsInAWeek = 7 * 24 * 60 * 60 * 1000;

export const getTimestampRelativeToNow = (hours: number, isFuture = false) => {
    const now = new Date();
    const offset = isFuture ? 1 : -1;
    const adjustedTimestamp = new Date(
        now.getTime() + offset * hours * 60 * 60 * 1000
    );
    return Math.floor(adjustedTimestamp.getTime() / 1000);
};

export const calculateTimeDifference = (timestamp: number) => {
    const targetDate = new Date(timestamp * 1000);
    const currentDate = new Date();
    return currentDate.getTime() - targetDate.getTime();
};

export const isRepaymentPeriod = (maturity: number) => {
    return Math.abs(calculateTimeDifference(maturity)) <= millisecondsInAWeek;
};

export const isRedemptionPeriod = (maturity: number) => {
    return calculateTimeDifference(maturity) >= millisecondsInAWeek;
};
