import { formatDate, getUTCMonthYear } from '@secured-finance/sf-core';
import dayjs from 'dayjs';
import { Maturity } from './entities';

export type MaturityInput = string | number | bigint | Maturity;

export class MaturityConverter {
    static fromInput(input: MaturityInput): Maturity {
        return input instanceof Maturity ? input : new Maturity(input);
    }

    static toNumber(maturity: Maturity): number {
        return maturity.toNumber();
    }

    static toString(maturity: Maturity): string {
        return maturity.toString();
    }

    static toUTCMonthYear(input: MaturityInput, numeric?: boolean): string {
        const maturity = this.fromInput(input);
        return getUTCMonthYear(maturity.toNumber(), numeric);
    }

    /**
     * Format maturities (already in seconds)
     */
    static toDateString(input: MaturityInput): string {
        const maturity = this.fromInput(input);
        const seconds = maturity.toNumber();
        return formatDate(seconds);
    }

    /**
     * Format raw JS timestamps (ms, ISO string, Date)
     */
    static toDateStringFromRaw(input: string | number | Date): string {
        const seconds = dayjs(input).unix();
        return formatDate(seconds);
    }
}
