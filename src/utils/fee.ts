import * as dayjs from 'dayjs';
import { percentFormat } from 'src/utils';
import { Maturity } from './entities';

const SECONDS_IN_YEAR = 365 * 24 * 60 * 60;
const PERCENTAGE_BASE = 100;

export class FeeCalculator {
    static calculateTransactionFees(
        maturity: number | Maturity,
        annualFee: number
    ): string {
        const maturityNumber = Number(maturity);
        const diff = dayjs.unix(maturityNumber).diff(Date.now(), 'second');
        const fee = Math.max((diff * annualFee) / SECONDS_IN_YEAR, 0);
        return percentFormat(fee);
    }

    static calculateProtocolFee(feeRate: number | bigint): number {
        return Number(feeRate) / PERCENTAGE_BASE;
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
