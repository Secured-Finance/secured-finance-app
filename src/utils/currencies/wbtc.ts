import { Token } from '@secured-finance/sf-core';
import assert from 'assert';
import { CurrencySymbol } from '../currencyList';

export class WBTC extends Token {
    private constructor() {
        assert(
            process.env.NEXT_PUBLIC_WBTC_CONTRACT_ADDRESS,
            'WBTC_CONTRACT_ADDRESS is not set'
        );
        super(
            1,
            process.env.NEXT_PUBLIC_WBTC_CONTRACT_ADDRESS,
            8,
            CurrencySymbol.BTC,
            'Bitcoin'
        );
    }

    private static instance: WBTC;

    public static onChain(): WBTC {
        this.instance = this.instance || new WBTC();
        return this.instance;
    }
}
