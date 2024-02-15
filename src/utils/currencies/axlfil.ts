import { Token } from '@secured-finance/sf-core';

export class AXLFIL extends Token {
    private constructor() {
        super(18, 'axlFIL', 'Axelar Wrapped FIL');
    }

    private static instance: AXLFIL;

    public static onChain(): AXLFIL {
        this.instance = this.instance || new AXLFIL();
        return this.instance;
    }
}
