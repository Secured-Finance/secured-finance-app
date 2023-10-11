import * as dayjs from 'dayjs';
import { divide } from '../currencyList';
import { Rate } from '../rate';

export class LoanValue {
    private _price!: number;
    private _apr!: Rate;

    protected _maturity!: number;
    protected _calculationDate!: number;

    private static PAR_VALUE = 10000;
    private PAR_VALUE_RATE = 1000000;
    private SECONDS_IN_YEAR = 365 * 24 * 60 * 60;

    private constructor() {
        // do nothing
    }

    public static get ZERO(): LoanValue {
        const loanValue = new LoanValue();
        loanValue._price = 0;
        loanValue._maturity = 0;
        loanValue._calculationDate = 0;
        loanValue._apr = new Rate(0);
        return loanValue;
    }

    public static fromPrice(
        price: number,
        maturity: number,
        calculationDate?: number
    ): LoanValue {
        const loanValue = new LoanValue();
        loanValue._price = price;
        loanValue._maturity = maturity;
        loanValue._calculationDate = calculationDate ? calculationDate : 0;
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
                    LoanValue.PAR_VALUE /
                        (1 + this._apr.toAbsoluteNumber() * yearFraction)
                );
            } else {
                this._price = Math.floor(
                    LoanValue.PAR_VALUE /
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
                if (this.price === 10000 || this.price === 0) {
                    this._apr = new Rate(0);
                    return this._apr;
                }
                const yearFraction = this.yearFraction();
                if (yearFraction <= 1) {
                    this._apr = new Rate(
                        ((LoanValue.PAR_VALUE / this._price - 1) /
                            yearFraction) *
                            this.PAR_VALUE_RATE
                    );
                } else {
                    this._apr = new Rate(
                        (Math.pow(
                            LoanValue.PAR_VALUE / this._price,
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

    public get maturity(): number {
        return this._maturity;
    }

    public static getMidValue(bid: LoanValue, ask: LoanValue): LoanValue {
        if (bid._maturity !== ask._maturity) {
            throw new Error('cannot compute mid value: maturity mismatch');
        }

        if (bid._calculationDate !== ask._calculationDate) {
            throw new Error('cannot compute mid value: calculateDate mismatch');
        }

        const bidPrice = bid.price ?? 0;
        const askPrice = ask.price === 0 ? LoanValue.PAR_VALUE : ask.price;

        const loanValue = new LoanValue();
        loanValue._price = (bidPrice + askPrice) / 2;
        loanValue._maturity = bid._maturity;
        loanValue._calculationDate = bid._calculationDate;
        return loanValue;
    }

    private dayToMaturity(): number {
        return dayjs
            .unix(this._maturity)
            .diff(
                this._calculationDate !== 0
                    ? this._calculationDate
                    : Date.now(),
                'second'
            );
    }

    private yearFraction(): number {
        return divide(this.dayToMaturity(), this.SECONDS_IN_YEAR, 10);
    }
}
