import assert from 'assert';
import { percentFormat } from './formatNumbers';

export class Rate {
    readonly rate: number;
    public constructor(value: number) {
        assert(value >= 0, 'Rate must be positive');
        this.rate = value;
    }

    public toNumber(): number {
        return this.rate;
    }

    public toPercent(): string {
        return percentFormat(this.rate, 1000000);
    }
}
