const ONE_PERCENT = 10000;
const MIN_RATE = 0;
const MAX_RATE = 1000 * ONE_PERCENT;

export class Rate {
    readonly rate: number;
    public constructor(value: number) {
        // cap and floor the value between 0 and 1000%
        this.rate = Math.min(Math.max(Math.floor(value), MIN_RATE), MAX_RATE);
    }

    public toNumber(): number {
        return Math.floor(this.rate);
    }

    public toNormalizedNumber(): number {
        return this.rate / ONE_PERCENT;
    }
}
