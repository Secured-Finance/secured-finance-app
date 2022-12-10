import { BigNumber } from 'ethers';

export class Maturity {
    readonly maturity: number;
    public constructor(maturity: number | string | BigNumber) {
        if (typeof maturity === 'string') {
            this.maturity = parseInt(maturity);
        } else if (typeof maturity === 'number') {
            this.maturity = maturity;
        } else {
            this.maturity = maturity.toNumber();
        }
    }

    public getMaturity(): number {
        return this.maturity;
    }

    public toString(): string {
        return this.maturity.toString();
    }

    public equals(other: Maturity): boolean {
        return this.maturity === other.maturity;
    }
}

export const EMPTY_MATURITY = new Maturity(0);
