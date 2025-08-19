export class MaturityConverter {
    static getUTCMonthYear(timestamp: number, numeric?: boolean): string {
        const date = new Date(timestamp * 1000);
        const month = date.toLocaleString('en-US', {
            month: 'short',
            timeZone: 'UTC',
        });
        const year = numeric
            ? String(date.getUTCFullYear())
            : String(date.getUTCFullYear()).slice(-2);
        return `${month.toUpperCase()}${year}`;
    }

    static formatDate(timestamp: number): string {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC',
        });
    }
}
