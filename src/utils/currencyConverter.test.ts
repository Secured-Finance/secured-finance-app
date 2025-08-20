import {
    ethBytes32,
    usdcBytes32,
    wbtcBytes32,
    wfilBytes32,
} from 'src/stories/mocks/fixtures';
import { CurrencyConverter } from './currencyConverter';
import { CurrencySymbol } from './currencyList';

describe('CurrencyConverter', () => {
    describe('hexToSymbol', () => {
        it('should convert hex to currency symbol', () => {
            expect(CurrencyConverter.hexToSymbol(ethBytes32)).toBe(
                CurrencySymbol.ETH
            );
            expect(CurrencyConverter.hexToSymbol(usdcBytes32)).toBe(
                CurrencySymbol.USDC
            );
            expect(CurrencyConverter.hexToSymbol(wbtcBytes32)).toBe(
                CurrencySymbol.WBTC
            );
            expect(CurrencyConverter.hexToSymbol(wfilBytes32)).toBe(
                CurrencySymbol.WFIL
            );
        });

        it('should return undefined for invalid hex', () => {
            const invalidHex =
                '0x494e56414c494400000000000000000000000000000000000000000000000000';
            expect(CurrencyConverter.hexToSymbol(invalidHex)).toBeUndefined();
        });
    });

    describe('parseSymbol', () => {
        it('should convert valid strings to currency symbols', () => {
            expect(CurrencyConverter.parseSymbol('ETH')).toBe(
                CurrencySymbol.ETH
            );
            expect(CurrencyConverter.parseSymbol('USDC')).toBe(
                CurrencySymbol.USDC
            );
            expect(CurrencyConverter.parseSymbol('WBTC')).toBe(
                CurrencySymbol.WBTC
            );
            expect(CurrencyConverter.parseSymbol('FIL')).toBe(
                CurrencySymbol.FIL
            );
        });

        it('should return undefined for invalid strings', () => {
            expect(CurrencyConverter.parseSymbol('INVALID')).toBeUndefined();
            expect(CurrencyConverter.parseSymbol('')).toBeUndefined();
        });
    });

    describe('symbolToContract', () => {
        it('should convert currency symbol to contract interface', () => {
            const ethContract = CurrencyConverter.symbolToContract(
                CurrencySymbol.ETH
            );
            expect(ethContract).toBeDefined();
            expect(ethContract.symbol).toBe('ETH');

            const usdcContract = CurrencyConverter.symbolToContract(
                CurrencySymbol.USDC
            );
            expect(usdcContract).toBeDefined();
            expect(usdcContract.symbol).toBe('USDC');
        });
    });

    describe('batchHexToSymbol', () => {
        it('should convert array of hex strings to currency symbols', () => {
            const hexArray = [ethBytes32, usdcBytes32];
            const result = CurrencyConverter.batchHexToSymbol(hexArray);
            expect(result).toEqual([CurrencySymbol.ETH, CurrencySymbol.USDC]);
        });

        it('should handle mixed valid and invalid hex strings', () => {
            const invalidHex =
                '0x494e56414c494400000000000000000000000000000000000000000000000000';
            const hexArray = [ethBytes32, invalidHex];
            const result = CurrencyConverter.batchHexToSymbol(hexArray);
            expect(result).toEqual([CurrencySymbol.ETH, undefined]);
        });
    });

    describe('batchSymbolToContract', () => {
        it('should convert array of symbols to contracts', () => {
            const symbols = [CurrencySymbol.ETH, CurrencySymbol.USDC];
            const result = CurrencyConverter.batchSymbolToContract(symbols);
            expect(result).toHaveLength(2);
            expect(result[0]).toBeDefined();
            expect(result[1]).toBeDefined();
        });
    });

    describe('batchParseSymbol', () => {
        it('should convert array of strings to currency symbols', () => {
            const strings = ['ETH', 'USDC', 'INVALID'];
            const result = CurrencyConverter.batchParseSymbol(strings);
            expect(result).toEqual([
                CurrencySymbol.ETH,
                CurrencySymbol.USDC,
                undefined,
            ]);
        });
    });

    describe('bytes32ToSymbol', () => {
        it('should convert bytes32 to currency symbol', () => {
            expect(CurrencyConverter.bytes32ToSymbol(ethBytes32)).toBe(
                CurrencySymbol.ETH
            );
            expect(CurrencyConverter.bytes32ToSymbol(usdcBytes32)).toBe(
                CurrencySymbol.USDC
            );
        });
    });
});
