import * as dayjs from 'dayjs';
import { Rate } from '../rate';

export class LoanValue {
    private _price!: number;
    private _apr!: Rate;

    protected _maturity!: number;

    private PAR_VALUE = 10000;
    private PAR_VALUE_RATE = 1000000;
    private DAYS_IN_YEAR = 365;

    private constructor() {
        // do nothing
    }

    public static get ZERO(): LoanValue {
        const loanValue = new LoanValue();
        loanValue._price = 0;
        loanValue._maturity = 0;
        loanValue._apr = new Rate(0);
        return loanValue;
    }

    public static fromPrice(price: number, maturity: number): LoanValue {
        const loanValue = new LoanValue();
        loanValue._price = price;
        loanValue._maturity = maturity;
        return loanValue;
    }

    public static fromApr(apr: Rate, maturity: number): LoanValue {
        const loanValue = new LoanValue();
        loanValue._apr = apr;
        loanValue._maturity = maturity;
        return loanValue;
    }

    public get price(): number {
        if (this._price === undefined && this._apr === undefined) {
            throw new Error('cannot compute price');
        }

        if (this._price === undefined) {
            const yearFraction = this.yearFraction();
            if (yearFraction <= 1) {
                this._price = Math.floor(
                    this.PAR_VALUE /
                        (1 + this._apr.toAbsoluteNumber() * yearFraction)
                );
            } else {
                this._price = Math.floor(
                    this.PAR_VALUE /
                        Math.pow(1 + this._apr.toAbsoluteNumber(), yearFraction)
                );
            }
        }

        return this._price;
    }

    public get apr(): Rate {
        if (this._apr === undefined && this._price === undefined) {
            throw new Error('cannot compute apr');
        }
        if (this._apr === undefined) {
            if (this.price !== undefined) {
                if (this.price === 0) {
                    this._apr = new Rate(0);
                    return this._apr;
                }
                const yearFraction = this.yearFraction();
                if (yearFraction <= 1) {
                    this._apr = new Rate(
                        ((this.PAR_VALUE / this._price - 1) / yearFraction) *
                            this.PAR_VALUE_RATE
                    );
                } else {
                    this._apr = new Rate(
                        (Math.pow(
                            this.PAR_VALUE / this._price,
                            1 / yearFraction
                        ) -
                            1) *
                            this.PAR_VALUE_RATE
                    );
                }
            }
        }

        return this._apr;
    }

    public static getMidValue(
        loanValue1: LoanValue,
        loanValue2: LoanValue
    ): LoanValue {
        if (loanValue1._maturity !== loanValue2._maturity) {
            throw new Error('cannot compute mid value: maturity mismatch');
        }

        const loanValue = new LoanValue();
        loanValue._price = (loanValue1.price + loanValue2.price) / 2;
        loanValue._maturity = loanValue1._maturity;
        return loanValue;
    }

    private dayToMaturity(): number {
        return dayjs.unix(this._maturity).diff(Date.now(), 'day');
    }

    private yearFraction(): number {
        return this.dayToMaturity() / this.DAYS_IN_YEAR;
    }
}
