import * as dayjs from 'dayjs';

const MILLISECONDS_PER_SECOND = 1000;

export class TimestampConverter {
    static toDate(timestamp: number): Date {
        return new Date(timestamp * MILLISECONDS_PER_SECOND);
    }

    static toNumber(value: string | number | bigint): number {
        return Number(value);
    }

    static formatTimestamp(timestamp: number | undefined): string {
        const date = this.toDate(timestamp ?? 0);
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'short',
            timeStyle: 'short',
        }).format(date);
    }

    static formatTimestampDDMMYY(timestamp?: number | string | bigint): string {
        const ts = Number(timestamp);

        if (
            isNaN(ts) ||
            ts === 0 ||
            timestamp === undefined ||
            timestamp === null
        )
            return '--';

        const date = this.toDate(ts);

        const formattedDate = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        }).format(date);

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${formattedDate}, ${hours}:${minutes}`;
    }

    static formatTimestampWithMonth(timestamp: number | undefined): string {
        const date = this.toDate(timestamp ?? 0);
        const month = new Intl.DateTimeFormat('en-US', {
            month: 'short',
        }).format(date);
        const day = date.getDate();
        const year = date.getFullYear();
        const time = date.toLocaleTimeString('en-GB', { timeZone: 'UTC' });

        return `${month} ${day}, ${year} ${time}`;
    }

    static formatTimeStampWithTimezone(timestamp: number | undefined): string {
        const date = this.toDate(timestamp ?? 0);
        return new Intl.DateTimeFormat('en-GB', {
            timeStyle: 'long',
        }).format(date);
    }

    static formatMaturity(
        maturityTimeStamp: number,
        timeUnit: 'day' | 'hours' | 'minutes',
        currentTime: number
    ): number {
        return dayjs.unix(maturityTimeStamp).diff(currentTime, timeUnit);
    }

    static calculateTimeDifference(timestamp: number): number {
        const targetDate = this.toDate(timestamp);
        const currentDate = new Date();
        return currentDate.getTime() - targetDate.getTime();
    }

    static getCurrentTimestamp(): number {
        return Math.floor(Date.now() / MILLISECONDS_PER_SECOND);
    }

    static calculateIntervalTimestamp(
        timestamp: number,
        interval: string | number
    ): number {
        const intervalNum = Number(interval);
        return Math.ceil(timestamp / intervalNum) * intervalNum;
    }
}
