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
