import { Token } from '@secured-finance/sf-core';

export class UMINT extends Token {
    private constructor() {
        super(18, 'uMINT', 'UBS Money Market Investment Fund Token');
    }

    private static instance: UMINT;

    public static onChain(): UMINT {
        this.instance = this.instance || new UMINT();
        return this.instance;
    }
}
