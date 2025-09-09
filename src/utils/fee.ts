import * as dayjs from 'dayjs';
import { Maturity } from './entities';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

const SECONDS_IN_YEAR = 365 * 24 * 60 * 60;
const PERCENTAGE_BASE = FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR;

export class FeeCalculator {
    static calculateTransactionFees(
        maturity: number | Maturity,
        annualFee: number
    ): string {
        const maturityNumber = Number(maturity);
        const diff = dayjs.unix(maturityNumber).diff(Date.now(), 'second');
        // annualFee is in percentage (1 = 1%), convert to decimal for calculation
        const annualFeeDecimal = annualFee / 100;
        const fee = Math.max((diff * annualFeeDecimal) / SECONDS_IN_YEAR, 0);
        // Format as percentage (fee is already a decimal)
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(fee);
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
