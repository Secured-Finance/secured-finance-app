import { Token } from '@secured-finance/sf-core';

export class USDC extends Token {
    private constructor() {
        super(
            1,
            '0x0000000000000000000000000000000000000001',
            18,
            'USDC',
            'USDC'
        );
    }

    private static instance: USDC;

    public static onChain(): USDC {
        this.instance = this.instance || new USDC();
        return this.instance;
    }
}
