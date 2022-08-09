import { Token } from '@secured-finance/sf-core';

export class Filecoin extends Token {
    private constructor() {
        super(
            1,
            '0x0000000000000000000000000000000000000000',
            18,
            'FIL',
            'Filecoin'
        );
    }

    private static instance: Filecoin;

    public static get(): Filecoin {
        this.instance = this.instance || new Filecoin();
        return this.instance;
    }
}
