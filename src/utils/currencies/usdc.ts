import { Token } from '@secured-finance/sf-core';
import assert from 'assert';

export class USDC extends Token {
    private constructor() {
        assert(
            process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS,
            'USDC_CONTRACT_ADDRESS is not set'
        );
        super(
            1,
            process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS,
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
