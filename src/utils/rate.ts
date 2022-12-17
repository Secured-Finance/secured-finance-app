const ONE_PERCENT = 10000;

export class Rate {
    readonly rate: number;
    public constructor(value: number) {
        this.rate = Math.floor(value);
    }

    public toNumber(): number {
        return Math.floor(this.rate);
    }

    public toNormalizedNumber(): number {
        return this.rate / ONE_PERCENT;
    }
}
