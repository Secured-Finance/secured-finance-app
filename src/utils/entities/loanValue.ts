import * as dayjs from 'dayjs';
import { divide } from '../currencyList';
import { Rate } from '../rate';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

export class LoanValue {
    private _price!: bigint;
    private _apr!: Rate;

    protected _maturity!: bigint;
    protected _calculationDate!: bigint;

    private static PAR_VALUE = BigInt(FINANCIAL_CONSTANTS.BPS_DIVISOR);
    private PAR_VALUE_RATE = 1000000n;
    private SECONDS_IN_YEAR = BigInt(365 * 24 * 60 * 60);
    private static PRECISION_MULTIPLIER = 1000000n;

    private constructor() {
        // Private constructor for controlled instantiation
    }

    public static get ZERO(): LoanValue {
        const loanValue = new LoanValue();
        loanValue._price = 0n;
        loanValue._maturity = 0n;
        loanValue._calculationDate = 0n;
        loanValue._apr = new Rate(0);
        return loanValue;
    }

    public static fromPrice(
        price: number | bigint,
        maturity: number | bigint,
        calculationDate?: number | bigint
    ): LoanValue {
        const loanValue = new LoanValue();
        loanValue._price =
            typeof price === 'number' ? BigInt(Math.floor(price)) : price;
        loanValue._maturity =
            typeof maturity === 'number'
                ? BigInt(Math.floor(maturity))
                : maturity;
        loanValue._calculationDate = calculationDate
            ? typeof calculationDate === 'number'
                ? BigInt(Math.floor(calculationDate))
                : calculationDate
            : 0n;
        return loanValue;
    }

    public static fromApr(apr: Rate, maturity: number | bigint): LoanValue {
        const loanValue = new LoanValue();
        loanValue._apr = apr;
        loanValue._maturity =
            typeof maturity === 'number'
                ? BigInt(Math.floor(maturity))
                : maturity;
        return loanValue;
    }

    public get price(): number {
        return Number(this.priceBigInt);
    }

    public get priceBigInt(): bigint {
        if (this._price === undefined && this._apr === undefined) {
            throw new Error('cannot compute price');
        }

        if (this._price === undefined) {
            const yearFraction = this.yearFraction();
            const aprAbsolute = this._apr.toAbsoluteNumber();

            if (yearFraction <= 1) {
                const denominator = 1 + aprAbsolute * yearFraction;
                const priceFloat = Number(LoanValue.PAR_VALUE) / denominator;
                this._price = BigInt(Math.floor(priceFloat));
            } else {
                const denominator = Math.pow(1 + aprAbsolute, yearFraction);
                const priceFloat = Number(LoanValue.PAR_VALUE) / denominator;
                this._price = BigInt(Math.floor(priceFloat));
            }
        }

        return this._price;
    }

    public get apr(): Rate {
        if (this._apr === undefined && this._price === undefined) {
            throw new Error('cannot compute apr');
        }
        if (this._apr === undefined) {
            if (this._price !== undefined) {
                if (this._price === LoanValue.PAR_VALUE || this._price === 0n) {
                    this._apr = new Rate(0);
                    return this._apr;
                }
                const yearFraction = this.yearFraction();

                if (yearFraction <= 1) {
                    const priceRatio =
                        Number(LoanValue.PAR_VALUE) / Number(this._price);
                    const rate =
                        ((priceRatio - 1) / yearFraction) *
                        Number(this.PAR_VALUE_RATE);
                    this._apr = new Rate(rate);
                } else {
                    const priceRatio =
                        Number(LoanValue.PAR_VALUE) / Number(this._price);
                    const rate =
                        (Math.pow(priceRatio, 1 / yearFraction) - 1) *
                        Number(this.PAR_VALUE_RATE);
                    this._apr = new Rate(rate);
                }
            }
        }

        return this._apr;
    }

    public get maturity(): number {
        return Number(this._maturity);
    }

    public get maturityBigInt(): bigint {
        return this._maturity;
    }

    public get calculationDate(): number {
        return Number(this._calculationDate);
    }

    public get calculationDateBigInt(): bigint {
        return this._calculationDate;
    }

    public static getMidValue(bid: LoanValue, ask: LoanValue): LoanValue {
        if (bid._maturity !== ask._maturity) {
            throw new Error('cannot compute mid value: maturity mismatch');
        }

        if (bid._calculationDate !== ask._calculationDate) {
            throw new Error('cannot compute mid value: calculateDate mismatch');
        }

        const bidPrice = bid.priceBigInt ?? 0n;
        const askPrice =
            ask.priceBigInt === 0n ? LoanValue.PAR_VALUE : ask.priceBigInt;

        const loanValue = new LoanValue();
        loanValue._price = (bidPrice + askPrice) / 2n;
        loanValue._maturity = bid._maturity;
        loanValue._calculationDate = bid._calculationDate;
        return loanValue;
    }

    private dayToMaturity(): number {
        return dayjs
            .unix(Number(this._maturity))
            .diff(
                this._calculationDate !== undefined &&
                    this._calculationDate !== 0n
                    ? Number(this._calculationDate) *
                          FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD
                    : Date.now(),
                'second'
            );
    }

    private dayToMaturityBigInt(): bigint {
        const diffSeconds = dayjs
            .unix(Number(this._maturity))
            .diff(
                this._calculationDate !== undefined &&
                    this._calculationDate !== 0n
                    ? Number(this._calculationDate) *
                          FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD
                    : Date.now(),
                'second'
            );
        return BigInt(diffSeconds);
    }

    private yearFraction(): number {
        return divide(this.dayToMaturity(), Number(this.SECONDS_IN_YEAR), 10);
    }

    private yearFractionBigInt(): bigint {
        const daysDiff = this.dayToMaturityBigInt();
        // Return as fraction with precision multiplier
        return (
            (daysDiff * LoanValue.PRECISION_MULTIPLIER) / this.SECONDS_IN_YEAR
        );
    }
}
