import { Token } from '@secured-finance/sf-core';
import assert from 'assert';

export class WFIL extends Token {
    private constructor() {
        assert(
            process.env.NEXT_PUBLIC_WFIL_CONTRACT_ADDRESS,
            'FIL_CONTRACT_ADDRESS is not set'
        );
        super(
            1,
            process.env.NEXT_PUBLIC_WFIL_CONTRACT_ADDRESS,
            18,
            'WFIL',
            'Filecoin'
        );
    }

    private static instance: WFIL;

    public static onChain(): WFIL {
        this.instance = this.instance || new WFIL();
        return this.instance;
    }
}
