import * as dayjs from 'dayjs';
import { percentFormat } from 'src/utils';

const SECONDS_IN_YEAR = 365 * 24 * 60 * 60;

export class FeeCalculator {
    static calculateTransactionFees(
        maturity: number | { toNumber(): number },
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
        return normalizedFee / 100;
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
        const futureValue = (amount * BigInt(10000)) / unitPrice;
        return (
            (futureValue * BigInt(Math.floor(timeBasedFee * 100))) /
            BigInt(10000)
        );
    }

    static applyDiscountRate(feeAmount: bigint, discountRate: number): bigint {
        if (discountRate <= 0) return feeAmount;
        const discount =
            (feeAmount * BigInt(Math.floor(discountRate * 10000))) /
            BigInt(10000);
        return feeAmount - discount;
    }
}
