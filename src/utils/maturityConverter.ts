import { Maturity } from './entities';
const MS_PER_SEC = 1000;

export class MaturityConverter {
    static fromInput(input: string | number | bigint): Maturity {
        return new Maturity(input);
    }

    static toNumber(maturity: Maturity): number {
        return maturity.toNumber();
    }

    static toString(maturity: Maturity): string {
        return maturity.toString();
    }

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
        const date = new Date(timestamp * MS_PER_SEC);
        const month = date.toLocaleString('en-US', {
            month: 'short',
            timeZone: 'UTC',
        });
        const year = numeric
            ? String(date.getUTCFullYear())
            : String(date.getUTCFullYear()).slice(-2);
        return `${month.toUpperCase()}${year}`;
    }

    static toDateString(input: string | number | bigint | Maturity): string {
        const timestamp = this.getTimestamp(input);
        const date = new Date(timestamp * MS_PER_SEC);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC',
        });
    }
}
