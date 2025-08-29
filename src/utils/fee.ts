import * as dayjs from 'dayjs';
import { PriceFormatter } from './priceFormatter';

const SECONDS_IN_YEAR = 365 * 24 * 60 * 60;

export const calculateFee = (maturity: number, annualFee: number) => {
    const diff = dayjs.unix(maturity).diff(Date.now(), 'second');
    const fee = Math.max((diff * annualFee) / SECONDS_IN_YEAR, 0);
    return PriceFormatter.formatPercentage(fee, 'percentage');
};
