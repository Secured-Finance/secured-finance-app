import * as dayjs from 'dayjs';
import { Rate } from '../rate';

export class LoanValue {
    private _price!: number;
    private _apy!: Rate;
    private _apr!: Rate;

    protected _maturity!: number;

    private PAR_VALUE = 10000;
    private DAYS_IN_YEAR = 365;

    private constructor() {
        // do nothing
    }

    public static get ZERO(): LoanValue {
        const loanValue = new LoanValue();
        loanValue._price = 0;
        loanValue._maturity = 0;
        loanValue._apy = new Rate(0);
        loanValue._apr = new Rate(0);
        return loanValue;
    }

    public static fromPrice(price: number, maturity: number): LoanValue {
        const loanValue = new LoanValue();
        loanValue._price = price;
        loanValue._maturity = maturity;
        return loanValue;
    }

    public static fromApy(apy: Rate, maturity: number): LoanValue {
        const loanValue = new LoanValue();
        loanValue._apy = apy;
        loanValue._maturity = maturity;
        return loanValue;
    }

    public static fromApr(apr: Rate): LoanValue {
        const loanValue = new LoanValue();
        loanValue._apr = apr;
        return loanValue;
    }

    public get price(): number {
        if (this._price === undefined && this._apy === undefined) {
            throw new Error('cannot compute price');
        }

        if (this._price === undefined) {
            if (this._apy.toNormalizedNumber() === 0) {
                return 0;
            }

            this._price = Math.floor(
                this.PAR_VALUE *
                    Math.exp(
                        -this.yearFraction() *
                            Math.log(
                                1 - this._apy.toNormalizedNumber() / 100000
                            )
                    )
            );
        }

        return this._price;
    }

    public get apy(): Rate {
        if (this._apy === undefined && this._price === undefined) {
            throw new Error('cannot compute apy');
        }

        if (this._apy === undefined) {
            if (this.price === 0 || this._maturity === 0) {
                return new Rate(0);
            }

            this._apy = new Rate(
                (Math.pow(
                    1 + this.apr.toNormalizedNumber() / this.DAYS_IN_YEAR,
                    this.dayToMaturity()
                ) -
                    1) *
                    100000
            );
        }
        return this._apy;
    }

    public get apr(): Rate {
        if (this._apr === undefined && this._price === undefined) {
            throw new Error('cannot compute apr');
        }

        if (this._apr === undefined) {
            this._apr = new Rate(
                (-Math.log(this._price / this.PAR_VALUE) /
                    this.yearFraction()) *
                    100000
            );
        }

        return this._apr;
    }

    private dayToMaturity(): number {
        return dayjs.unix(this._maturity).diff(Date.now(), 'day');
    }

    private yearFraction(): number {
        return this.dayToMaturity() / this.DAYS_IN_YEAR;
    }
}
