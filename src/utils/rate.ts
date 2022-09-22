import assert from 'assert';
import { percentFormat } from './formatNumbers';

export class Rate {
    ONE_PERCENT = 10000;
    readonly rate: number;
    public constructor(value: number) {
        assert(value >= 0, 'Rate must be positive');
        this.rate = value;
    }

    public toNumber(): number {
        return this.rate;
    }

    public toNormalizedNumber(): number {
        return this.rate / this.ONE_PERCENT;
    }

    public toPercent(): string {
        return percentFormat(this.toNormalizedNumber(), 100);
    }
}
