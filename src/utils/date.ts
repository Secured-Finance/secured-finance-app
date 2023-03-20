export function isPastDate(utcTimestamp: number): boolean {
    return utcTimestamp <= Date.now() / 1000;
}
