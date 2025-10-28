import { Token } from '@secured-finance/sf-core';

export class JPYC extends Token {
    private constructor() {
        super(18, 'JPYC', 'JPY Coin', true);
    }

    private static instance: JPYC;

    public static onChain(): JPYC {
        this.instance = this.instance || new JPYC();
        return this.instance;
    }
}
