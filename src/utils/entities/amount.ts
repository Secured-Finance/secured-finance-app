import { BigNumber } from 'ethers';
import { CurrencyInfo, currencyMap, CurrencySymbol } from '../currencyList';

export class Amount {
    private readonly _baseValue: BigNumber;
    private readonly _formatterFromBase: CurrencyInfo['fromBaseUnit'];
    private readonly _currency: CurrencySymbol;

    constructor(value: BigNumber, ccy: CurrencySymbol) {
        this._baseValue = value;
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
}
