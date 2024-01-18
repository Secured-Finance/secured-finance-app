import { Token } from '@secured-finance/sf-core';
import { CurrencySymbol } from '../currencyList';

export class WETHE extends Token {
    private constructor() {
        super(18, CurrencySymbol.WETHe, 'Wrapped Ether');
    }

    private static instance: WETHE;

    public static onChain(): WETHE {
        this.instance = this.instance || new WETHE();
        return this.instance;
    }
}
