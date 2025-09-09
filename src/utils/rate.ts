import { FINANCIAL_CONSTANTS } from 'src/config/constants';

export const ONE_PERCENT = FINANCIAL_CONSTANTS.BPS_DIVISOR;
const MIN_RATE = 0;
const MAX_RATE = FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD * ONE_PERCENT;

export class Rate {
    readonly rate: number;
    public constructor(value: number) {
        // cap and floor the value between 0 and FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD%
        this.rate = Math.min(Math.max(Math.floor(value), MIN_RATE), MAX_RATE);
    }

    public toNumber(): number {
        return Math.floor(this.rate);
    }

    public toNormalizedNumber(): number {
        return this.rate / ONE_PERCENT;
    }

    public toAbsoluteNumber(): number {
        return (
            this.toNormalizedNumber() / FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR
        );
    }
}
