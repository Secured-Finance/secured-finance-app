import { Maturity } from './entities';

export class MaturityConverter {
    // Parse raw input and create Maturity object
    static fromInput(input: string | number | bigint): Maturity {
        return new Maturity(input);
    }

    // Convert Maturity to number
    static toNumber(maturity: Maturity): number {
        return maturity.toNumber();
    }

    // Convert Maturity to string
    static toString(maturity: Maturity): string {
        return maturity.toString();
    }

    // Internal helper to get timestamp from any input type
    private static getTimestamp(
        input: string | number | bigint | Maturity
    ): number {
        if (input instanceof Maturity) {
            return input.toNumber();
        }
        return this.fromInput(input).toNumber();
    }

    // Format as UTC month/year (e.g., "JAN25" or "JAN2025")
    static toUTCMonthYear(
        input: string | number | bigint | Maturity,
        numeric?: boolean
    ): string {
        const timestamp = this.getTimestamp(input);
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

    // Format as date string (e.g., "Jan 1, 2025")
    static toDateString(input: string | number | bigint | Maturity): string {
        const timestamp = this.getTimestamp(input);
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC',
        });
    }
}
