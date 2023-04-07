import { Token } from '@secured-finance/sf-core';
import assert from 'assert';

export class EFIL extends Token {
    private constructor() {
        assert(
            process.env.NEXT_PUBLIC_EFIL_CONTRACT_ADDRESS,
            'FIL_CONTRACT_ADDRESS is not set'
        );
        super(
            1,
            process.env.NEXT_PUBLIC_EFIL_CONTRACT_ADDRESS,
            18,
            'EFIL',
            'EFIL'
        );
    }

    private static instance: EFIL;

    public static onChain(): EFIL {
        this.instance = this.instance || new EFIL();
        return this.instance;
    }
}
