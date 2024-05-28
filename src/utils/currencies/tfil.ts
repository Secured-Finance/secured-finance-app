import { BaseCurrency, NativeCurrency } from '@secured-finance/sf-core';

export class TFIL extends NativeCurrency {
    private constructor() {
        super(18, 'tFIL', 'Testnet Filecoin');
    }

    private static instance: TFIL;

    public static onChain(): TFIL {
        return this.instance ?? (this.instance = new TFIL());
    }

    public readonly wrapped = this;
    public equals(other: BaseCurrency): boolean {
        return other.isNative && other.symbol === this.symbol;
    }
}
