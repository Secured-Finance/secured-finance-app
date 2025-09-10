import { CurrencySymbol, currencyMap } from './currencyList';

export class AmountConverter {
    static fromBase(
        amount: string | number | bigint | undefined,
        currency: CurrencySymbol
    ): number {
        if (amount === undefined) return 0;

        if (
            typeof amount === 'string' &&
            (!amount.trim() || isNaN(Number(amount)))
        ) {
            return 0;
        }

        return currencyMap[currency].fromBaseUnit(BigInt(amount));
    }

    static toBase(
        input: string | number | bigint | undefined,
        currency: CurrencySymbol
    ): bigint {
        if (input === undefined) {
            return BigInt(0);
        }

        if (typeof input === 'string') {
            const trimmed = input.trim();
            if (!trimmed || trimmed === '.' || isNaN(Number(trimmed))) {
                return BigInt(0);
            }

            return currencyMap[currency].toBaseUnit(Number(trimmed));
        }

        return currencyMap[currency].toBaseUnit(Number(input));
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
