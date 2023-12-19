import { Token } from '@secured-finance/sf-core';
import { CurrencySymbol } from '../currencyList';

export class WBTC extends Token {
    private constructor() {
        super(1, 8, CurrencySymbol.WBTC, 'Bitcoin');
    }

    private static instance: WBTC;

    public static onChain(): WBTC {
        this.instance = this.instance || new WBTC();
        return this.instance;
    }
}
