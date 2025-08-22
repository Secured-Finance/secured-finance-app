import { OrderSide } from '@secured-finance/sf-client';
import { CurrencySymbol, amountFormatterFromBase } from './currencyList';

/* eslint-disable @typescript-eslint/no-namespace */
export namespace Domain {
    export interface Amount {
        value: number; // UI-facing number in currency units
        currency: CurrencySymbol;
        baseValue: bigint; // canonical base-unit amount
    }

    export interface Price {
        value: number; // protocol price (0..10000)
    }

    export interface Collateral {
        amount: Amount;
        isBorrowed: boolean;
    }

    export interface Order {
        currency: CurrencySymbol;
        maturity: number;
        side: OrderSide;
        amount: Amount;
        price?: Price;
    }

    // Contract (bigint) → Domain mappers
    export function fromContractAmount(
        currency: CurrencySymbol,
        baseAmount: bigint
    ): Amount {
        const formatter = amountFormatterFromBase[currency];
        return {
            value: formatter(baseAmount),
            currency,
            baseValue: baseAmount,
        };
    }

    export function fromContractPrice(unitPrice: bigint | number): Price {
        const value =
            typeof unitPrice === 'bigint' ? Number(unitPrice) : unitPrice;
        validatePrice(value);
        return { value };
    }

    export function fromContractOrder({
        currency,
        maturity,
        side,
        amountBase,
        unitPrice,
    }: {
        currency: CurrencySymbol;
        maturity: number;
        side: OrderSide;
        amountBase: bigint;
        unitPrice?: bigint | number;
    }): Order {
        return {
            currency,
            maturity,
            side,
            amount: fromContractAmount(currency, amountBase),
            price:
                unitPrice !== undefined
                    ? fromContractPrice(unitPrice)
                    : undefined,
        };
    }

    // Subgraph (string) → Domain mappers
    export function fromSubgraphAmount(
        currency: CurrencySymbol,
        baseAmountStr: string
    ): Amount {
        // Sanitize to digits only and parse as bigint
        const sanitized = baseAmountStr.replace(/[^0-9]/g, '');
        const baseAmount = BigInt(sanitized || '0');
        return fromContractAmount(currency, baseAmount);
    }

    export function fromSubgraphPrice(priceStr: string): Price {
        const value = parseFloat(priceStr);
        if (isNaN(value)) {
            throw new Error(`Invalid price string: ${priceStr}`);
        }
        validatePrice(value);
        return { value };
    }

    export function fromSubgraphOrder({
        currency,
        maturity,
        side,
        amount,
        executionPrice,
    }: {
        currency: CurrencySymbol;
        maturity: number;
        side: OrderSide;
        amount: string;
        executionPrice?: string;
    }): Order {
        return {
            currency,
            maturity,
            side,
            amount: fromSubgraphAmount(currency, amount),
            price:
                executionPrice !== undefined
                    ? fromSubgraphPrice(executionPrice)
                    : undefined,
        };
    }

    // Type guards
    export function isAmount(x: unknown): x is Amount {
        return (
            typeof x === 'object' &&
            x !== null &&
            'value' in x &&
            'currency' in x &&
            'baseValue' in x &&
            typeof x.value === 'number' &&
            typeof x.currency === 'string' &&
            typeof x.baseValue === 'bigint'
        );
    }

    export function isPrice(x: unknown): x is Price {
        return (
            typeof x === 'object' &&
            x !== null &&
            'value' in x &&
            typeof x.value === 'number' &&
            x.value >= 0 &&
            x.value <= 10000
        );
    }

    export function isCollateral(x: unknown): x is Collateral {
        return (
            typeof x === 'object' &&
            x !== null &&
            'amount' in x &&
            'isBorrowed' in x &&
            isAmount(x.amount) &&
            typeof x.isBorrowed === 'boolean'
        );
    }

    export function isOrder(x: unknown): x is Order {
        return (
            typeof x === 'object' &&
            x !== null &&
            'currency' in x &&
            'maturity' in x &&
            'side' in x &&
            'amount' in x &&
            typeof x.currency === 'string' &&
            typeof x.maturity === 'number' &&
            typeof x.side === 'number' &&
            isAmount(x.amount) &&
            (!('price' in x) || x.price === undefined || isPrice(x.price))
        );
    }

    // Validators
    export function validatePrice(n: number): void {
        if (n < 0 || n > 10000) {
            throw new Error(`Price must be between 0 and 10000, got: ${n}`);
        }
    }

    export function validateAmountValue(n: number): void {
        if (n < 0) {
            throw new Error(`Amount value must be >= 0, got: ${n}`);
        }
    }
}
