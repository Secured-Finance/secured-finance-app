import { Token } from '@secured-finance/sf-core';

export class ISNR extends Token {
    private constructor() {
        super(18, 'iSNR', 'DigiFT iSNR', true);
    }

    private static instance: ISNR;

    public static onChain(): ISNR {
        this.instance = this.instance || new ISNR();
        return this.instance;
    }
}
