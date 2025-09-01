import { Currency } from '@secured-finance/sf-core';
import { fromBytes32 } from '@secured-finance/sf-graph-client';
import { hexToString } from 'viem';
import { CurrencySymbol, currencyMap } from './currencyList';

const getAllowedSymbols = (() => {
    let symbols: Set<string> | null = null;
    return (): Set<string> => {
        if (!symbols) {
            symbols = new Set(
                Object.values(CurrencySymbol) as CurrencySymbol[]
            );
        }
        return symbols;
    };
})();

export class CurrencyConverter {
    static hexToSymbol(hex: string): CurrencySymbol | undefined {
        const symbolString = hexToString(hex as `0x${string}`, { size: 32 });
        return this.parseSymbol(symbolString);
    }

    static parseSymbol(str: string): CurrencySymbol | undefined {
        if (!str) return undefined;
        return getAllowedSymbols().has(str)
            ? (str as CurrencySymbol)
            : undefined;
    }

    static symbolToContract(symbol: CurrencySymbol): Currency {
        return currencyMap[symbol].toCurrency();
    }

    static batchHexToSymbol(
        hexArray: string[]
    ): (CurrencySymbol | undefined)[] {
        return hexArray.map(hex => this.hexToSymbol(hex));
    }

    static batchSymbolToContract(symbols: CurrencySymbol[]): Currency[] {
        return symbols.map(symbol => this.symbolToContract(symbol));
    }

    static batchParseSymbol(strings: string[]): (CurrencySymbol | undefined)[] {
        return strings.map(str => this.parseSymbol(str));
    }

    static bytes32ToSymbol(bytes32: string): CurrencySymbol | undefined {
        const symbolString = fromBytes32(bytes32);
        return this.parseSymbol(symbolString);
    }

    static batchBytes32ToSymbol(
        bytes32Array: string[]
    ): (CurrencySymbol | undefined)[] {
        return bytes32Array.map(bytes32 => this.bytes32ToSymbol(bytes32));
    }
}
