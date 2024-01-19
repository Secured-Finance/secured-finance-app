import { Token } from '@secured-finance/sf-core';
import { CurrencySymbol } from '../currencyList';

export class BTCB extends Token {
    private constructor() {
        super(8, CurrencySymbol.BTCb, 'Bitcoin');
    }

    private static instance: BTCB;

    public static onChain(): BTCB {
        this.instance = this.instance || new BTCB();
        return this.instance;
    }
}
