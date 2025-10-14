import { CurrencyInfo, CurrencySymbol, currencyMap } from '../currencyList';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

export type BigNumberish = bigint | string | number;

export const AMOUNT_PRECISION = FINANCIAL_CONSTANTS.BPS_DIVISOR;

export class Amount {
    private readonly _baseValue: bigint;
    private readonly _formatterFromBase: CurrencyInfo['fromBaseUnit'];
    private readonly _currency: CurrencySymbol;

    constructor(value: BigNumberish, ccy: CurrencySymbol) {
        this._baseValue = BigInt(value);
        this._currency = ccy;
        this._formatterFromBase = currencyMap[ccy].fromBaseUnit;
    }

    get value(): number {
        return this._formatterFromBase(this._baseValue);
    }

    get currency(): CurrencySymbol {
        return this._currency;
    }

    toUSD(price: number) {
        return this.value * price;
    }

    toBigInt() {
        return this._baseValue;
    }
}
