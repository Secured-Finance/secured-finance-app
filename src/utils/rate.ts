import * as dayjs from 'dayjs';
import { BigNumber } from 'ethers';
import { percentFormat } from './formatNumbers';

const ONE_PERCENT = 10000;
const PAR_VALUE = 10000;

export class Rate {
    readonly rate: number;
    public constructor(value: number) {
        this.rate = value;
    }

    public toNumber(): number {
        return Math.floor(this.rate);
    }

    public toNormalizedNumber(): number {
        return this.rate / ONE_PERCENT;
    }

    public toPercent(): string {
        return percentFormat(this.toNormalizedNumber(), 100);
    }

    public static fromPrice(price: BigNumber, maturity: BigNumber): Rate {
        const bondPrice = price.toNumber() / PAR_VALUE;
        const yearFraction =
            dayjs.unix(maturity.toNumber()).diff(Date.now(), 'day') / 365;
        return new Rate(
            Math.floor((-Math.log(bondPrice) / yearFraction) * 100000)
        );
    }
}
