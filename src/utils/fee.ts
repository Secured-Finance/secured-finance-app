import * as dayjs from 'dayjs';
import { Maturity } from './entities';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

const SECONDS_IN_YEAR = BigInt(365 * 24 * 60 * 60);
const PERCENTAGE_BASE = BigInt(FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR);

export class FeeCalculator {
    static calculateTransactionFees(
        maturity: number | Maturity,
        annualFee: number
    ): string {
        const maturityNumber = Number(maturity);
        const diff = dayjs.unix(maturityNumber).diff(Date.now(), 'second');
        const annualFeeDecimal = annualFee / 100;
        const fee = Math.max(
            (diff * annualFeeDecimal) / Number(SECONDS_IN_YEAR),
            0
        );

        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(fee);
    }

    static calculateProtocolFee(feeRate: number | bigint): number {
        const feeRateBigInt =
            typeof feeRate === 'number' ? BigInt(Math.floor(feeRate)) : feeRate;
        return Number(feeRateBigInt) / Number(PERCENTAGE_BASE);
    }

    static calculateProtocolFeeBigInt(feeRate: number | bigint): bigint {
        const feeRateBigInt =
            typeof feeRate === 'number' ? BigInt(Math.floor(feeRate)) : feeRate;
        return feeRateBigInt / PERCENTAGE_BASE;
    }

    static calculateFutureValueWithFee(
        futureValue: bigint | string,
        feeInFV: bigint | string,
        side: number
    ): bigint {
        const futureValueBigInt = BigInt(futureValue);
        const feeInFVBigInt = BigInt(feeInFV);

        return side === 0
            ? futureValueBigInt - feeInFVBigInt
            : futureValueBigInt + feeInFVBigInt;
    }
}
