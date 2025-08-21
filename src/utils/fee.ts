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
}
