import * as dayjs from 'dayjs';
import { percentFormat } from 'src/utils';
import { Maturity } from './entities';

const SECONDS_IN_YEAR = 365 * 24 * 60 * 60;
const PERCENTAGE_BASE = 100;
const BASIS_POINTS_BASE = 10000;

export class FeeCalculator {
    static calculateTransactionFees(
        maturity: number | Maturity,
        annualFee: number
    ): string {
        const normalizedMaturity =
            typeof maturity === 'object' ? maturity.toNumber() : maturity;
        const diff = dayjs.unix(normalizedMaturity).diff(Date.now(), 'second');
        const fee = Math.max((diff * annualFee) / SECONDS_IN_YEAR, 0);
        return percentFormat(fee);
    }

    static calculateProtocolFee(feeRate: number | bigint): number {
        const normalizedFee =
            typeof feeRate === 'bigint' ? Number(feeRate) : feeRate;
        return normalizedFee / PERCENTAGE_BASE;
    }

    static calculateFutureValueWithFee(
        futureValue: bigint | string,
        feeInFV: bigint | string,
        side: number
    ): bigint {
        const normalizedFV =
            typeof futureValue === 'string' ? BigInt(futureValue) : futureValue;
        const normalizedFee =
            typeof feeInFV === 'string' ? BigInt(feeInFV) : feeInFV;

        if (side === 0) {
            return normalizedFV - normalizedFee;
        }
        return normalizedFV + normalizedFee;
    }

    static calculateFeeInFutureValue(
        amount: bigint,
        unitPrice: bigint,
        feeRate: number,
        maturity: number | { toNumber(): number }
    ): bigint {
        const normalizedMaturity =
            typeof maturity === 'object' ? maturity.toNumber() : maturity;
        const diff = dayjs.unix(normalizedMaturity).diff(Date.now(), 'second');
        const timeBasedFee = Math.max((diff * feeRate) / SECONDS_IN_YEAR, 0);
        const futureValue = (amount * BigInt(BASIS_POINTS_BASE)) / unitPrice;
        const timeBasedFeePercent = Math.floor(timeBasedFee * PERCENTAGE_BASE);
        return (
            (futureValue * BigInt(timeBasedFeePercent)) /
            BigInt(BASIS_POINTS_BASE)
        );
    }

    static applyDiscountRate(feeAmount: bigint, discountRate: number): bigint {
        if (discountRate <= 0) return feeAmount;
        const discountRateBpsInt = Math.floor(discountRate * BASIS_POINTS_BASE);
        const discount =
            (feeAmount * BigInt(discountRateBpsInt)) /
            BigInt(BASIS_POINTS_BASE);
        return feeAmount - discount;
    }
}
