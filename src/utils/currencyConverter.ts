import { Currency } from '@secured-finance/sf-core';
import { fromBytes32 } from '@secured-finance/sf-graph-client';
import { hexToString } from 'viem';
import { CurrencySymbol, currencyMap } from './currencyList';

export class CurrencyConverter {
    static hexToSymbol(hex: string): CurrencySymbol | undefined {
        const symbolString = hexToString(hex as `0x${string}`, { size: 32 });
        return this.stringToSymbol(symbolString);
    }

    static stringToSymbol(str: string): CurrencySymbol | undefined {
        switch (str) {
            case CurrencySymbol.ETH:
                return CurrencySymbol.ETH;
            case CurrencySymbol.FIL:
                return CurrencySymbol.FIL;
            case CurrencySymbol.tFIL:
                return CurrencySymbol.tFIL;
            case CurrencySymbol.WETHe:
                return CurrencySymbol.WETHe;
            case CurrencySymbol.WFIL:
                return CurrencySymbol.WFIL;
            case CurrencySymbol.USDC:
                return CurrencySymbol.USDC;
            case CurrencySymbol.USDFC:
                return CurrencySymbol.USDFC;
            case CurrencySymbol.WBTC:
                return CurrencySymbol.WBTC;
            case CurrencySymbol.BTCb:
                return CurrencySymbol.BTCb;
            case CurrencySymbol.aUSDC:
                return CurrencySymbol.aUSDC;
            case CurrencySymbol.axlFIL:
                return CurrencySymbol.axlFIL;
            case CurrencySymbol.iFIL:
                return CurrencySymbol.iFIL;
            case CurrencySymbol.wpFIL:
                return CurrencySymbol.wpFIL;
            default:
                return undefined;
        }
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

    static batchStringToSymbol(
        strings: string[]
    ): (CurrencySymbol | undefined)[] {
        return strings.map(str => this.stringToSymbol(str));
    }

    static bytes32ToSymbol(bytes32: string): CurrencySymbol | undefined {
        const symbolString = fromBytes32(bytes32);
        return this.stringToSymbol(symbolString);
    }

    static batchBytes32ToSymbol(
        bytes32Array: string[]
    ): (CurrencySymbol | undefined)[] {
        return bytes32Array.map(bytes32 => this.bytes32ToSymbol(bytes32));
    }
}
