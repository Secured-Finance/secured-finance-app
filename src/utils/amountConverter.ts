import { CurrencySymbol, currencyMap } from './currencyList';

export class AmountConverter {
    static fromBase(amount: bigint, currency: CurrencySymbol): number {
        return currencyMap[currency].fromBaseUnit(amount);
    }

    static toBase(amount: number, currency: CurrencySymbol): bigint {
        return currencyMap[currency].toBaseUnit(amount);
    }

    static formatWithPrecision(
        amount: bigint,
        currency: CurrencySymbol,
        precision?: number
    ): string {
        const displayValue = this.fromBase(amount, currency);
        const decimals = precision ?? currencyMap[currency].roundingDecimal;
        return displayValue.toFixed(decimals);
    }

    static batchFromBase(
        amounts: bigint[],
        currencies: CurrencySymbol[]
    ): number[] {
        return amounts.map((amount, index) =>
            this.fromBase(amount, currencies[index])
        );
    }

    static batchToBase(
        amounts: number[],
        currencies: CurrencySymbol[]
    ): bigint[] {
        return amounts.map((amount, index) =>
            this.toBase(amount, currencies[index])
        );
    }
}
