import { CurrencySymbol, currencyMap } from './currencyList';

export class AmountConverter {
    static fromBase(amount: bigint, currency: CurrencySymbol): number {
        return currencyMap[currency].fromBaseUnit(amount);
    }

    static toBase(input: string | number, currency: CurrencySymbol): bigint {
        if (typeof input === 'string') {
            // Handle edge cases for user input
            if (!input || input === '.' || input === '') {
                return BigInt(0);
            }

            // Parse string to number, handling precision
            const parsed = parseFloat(input);
            if (isNaN(parsed)) {
                return BigInt(0);
            }

            return currencyMap[currency].toBaseUnit(parsed);
        }

        return currencyMap[currency].toBaseUnit(input);
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
        amounts: (string | number)[],
        currencies: CurrencySymbol[]
    ): bigint[] {
        return amounts.map((amount, index) =>
            this.toBase(amount, currencies[index])
        );
    }
}
