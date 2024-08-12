import { Token } from '@secured-finance/sf-core';

export class USDC extends Token {
    private constructor() {
        super(6, 'USDC', 'USDC', true);
    }

    private static instance: USDC;

    public static onChain(): USDC {
        this.instance = this.instance || new USDC();
        return this.instance;
    }
}
