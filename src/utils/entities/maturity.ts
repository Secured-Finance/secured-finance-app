export class Maturity {
    private readonly maturity: number;
    public constructor(maturity: number | string | bigint) {
        if (typeof maturity === 'string') {
            this.maturity = parseInt(maturity);
        } else if (typeof maturity === 'number') {
            this.maturity = maturity;
        } else {
            this.maturity = Number(maturity);
        }
    }

    public toNumber(): number {
        return this.maturity;
    }

    public toString(): string {
        return this.maturity.toString();
    }

    public equals(other: Maturity): boolean {
        return this.maturity === other.maturity;
    }

    public isZero(): boolean {
        return this.maturity === 0;
    }
}
