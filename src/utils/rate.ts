import { FINANCIAL_CONSTANTS } from 'src/config/constants';

export const ONE_PERCENT = BigInt(FINANCIAL_CONSTANTS.BPS_DIVISOR);
const MIN_RATE = 0n;
const MAX_RATE = BigInt(FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD) * ONE_PERCENT;

export class Rate {
    readonly rate: bigint;
    public constructor(value: number | bigint) {
        const bigIntValue =
            typeof value === 'number' ? BigInt(Math.floor(value)) : value;
        // cap and floor the value between 0 and FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD%
        this.rate =
            bigIntValue < MIN_RATE
                ? MIN_RATE
                : bigIntValue > MAX_RATE
                ? MAX_RATE
                : bigIntValue;
    }

    public toNumber(): number {
        return Number(this.rate);
    }

    public toBigInt(): bigint {
        return this.rate;
    }

    public toNormalizedNumber(): number {
        return Number(this.rate) / Number(ONE_PERCENT);
    }

    public toNormalizedBigInt(): bigint {
        return this.rate / ONE_PERCENT;
    }

    public toAbsoluteNumber(): number {
        return (
            this.toNormalizedNumber() / FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR
        );
    }

    public toAbsoluteBigInt(): bigint {
        return (
            this.toNormalizedBigInt() /
            BigInt(FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR)
        );
    }
}
