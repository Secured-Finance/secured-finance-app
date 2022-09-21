import { Token } from '@secured-finance/sf-core';
import assert from 'assert';

export class Filecoin extends Token {
    private constructor() {
        assert(
            process.env.NEXT_PUBLIC_EFIL_CONTRACT_ADDRESS,
            'EFIL_CONTRACT_ADDRESS is not set'
        );
        super(
            1,
            process.env.NEXT_PUBLIC_EFIL_CONTRACT_ADDRESS,
            18,
            'FIL',
            'Filecoin'
        );
    }

    private static instance: Filecoin;

    public static onChain(): Filecoin {
        this.instance = this.instance || new Filecoin();
        return this.instance;
    }
}
