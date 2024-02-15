import { Token } from '@secured-finance/sf-core';

export class WFIL extends Token {
    private constructor() {
        super(18, 'WFIL', 'Filecoin');
    }

    private static instance: WFIL;

    public static onChain(): WFIL {
        this.instance = this.instance || new WFIL();
        return this.instance;
    }
}
