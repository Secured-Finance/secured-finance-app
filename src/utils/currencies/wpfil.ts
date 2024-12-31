import { Token } from '@secured-finance/sf-core';

export class WPFIL extends Token {
    private constructor() {
        super(18, 'wpFIL', 'Wrapped PFIL Token', true);
    }

    private static instance: WPFIL;

    public static onChain(): WPFIL {
        this.instance = this.instance || new WPFIL();
        return this.instance;
    }
}
