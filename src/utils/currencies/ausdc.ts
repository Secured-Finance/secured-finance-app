import { Token } from '@secured-finance/sf-core';

export class AUSDC extends Token {
    private constructor() {
        super(1, 6, 'aUSDC', 'Axelar USDC');
    }

    private static instance: AUSDC;

    public static onChain(): AUSDC {
        this.instance = this.instance || new AUSDC();
        return this.instance;
    }
}
