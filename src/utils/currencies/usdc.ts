import { Token } from '@secured-finance/sf-core';
import { isProdEnv } from 'src/utils';

export class USDC extends Token {
    private constructor() {
        super(6, 'USDC', 'USDC', true, isProdEnv() ? '2' : '1');
    }

    private static instance: USDC;

    public static onChain(): USDC {
        this.instance = this.instance || new USDC();
        return this.instance;
    }
}
