import { AmountConverter } from './amountConverter';
import { CurrencySymbol } from './currencyList';

describe('AmountConverter', () => {
    describe('fromBase', () => {
        it('should convert ETH from base to display', () => {
            const baseAmount = BigInt('1000000000000000000'); // 1 ETH in wei
            expect(
                AmountConverter.fromBase(baseAmount, CurrencySymbol.ETH)
            ).toBe(1);
        });

        it('should convert USDC from base to display', () => {
            const baseAmount = BigInt('1000000'); // 1 USDC in base units
            expect(
                AmountConverter.fromBase(baseAmount, CurrencySymbol.USDC)
            ).toBe(1);
        });

        it('should convert WBTC from base to display', () => {
            const baseAmount = BigInt('100000000'); // 1 WBTC in satoshi
            expect(
                AmountConverter.fromBase(baseAmount, CurrencySymbol.WBTC)
            ).toBe(1);
        });
    });

    describe('toBase', () => {
        it('should convert ETH from display to base', () => {
            const result = AmountConverter.toBase(1, CurrencySymbol.ETH);
            expect(result.toString()).toBe('1000000000000000000');
        });

        it('should convert USDC from display to base', () => {
            const result = AmountConverter.toBase(1, CurrencySymbol.USDC);
            expect(result.toString()).toBe('1000000');
        });

        it('should convert WBTC from display to base', () => {
            const result = AmountConverter.toBase(1, CurrencySymbol.WBTC);
            expect(result.toString()).toBe('100000000');
        });

        it('should handle decimal amounts', () => {
            const result = AmountConverter.toBase(1.5, CurrencySymbol.ETH);
            expect(result.toString()).toBe('1500000000000000000');
        });

        it('should handle string input', () => {
            const result = AmountConverter.toBase('1.5', CurrencySymbol.ETH);
            expect(result.toString()).toBe('1500000000000000000');
        });

        it('should handle empty string input', () => {
            const result = AmountConverter.toBase('', CurrencySymbol.ETH);
            expect(result.toString()).toBe('0');
        });

        it('should handle dot-only input', () => {
            const result = AmountConverter.toBase('.', CurrencySymbol.ETH);
            expect(result.toString()).toBe('0');
        });

        it('should handle invalid string input', () => {
            const result = AmountConverter.toBase(
                'invalid',
                CurrencySymbol.ETH
            );
            expect(result.toString()).toBe('0');
        });

        it('should handle partial decimal input', () => {
            const result = AmountConverter.toBase('0.5', CurrencySymbol.ETH);
            expect(result.toString()).toBe('500000000000000000');
        });
    });

    describe('formatWithPrecision', () => {
        it('should format with default precision', () => {
            const baseAmount = BigInt('1230000000000000000'); // 1.23 ETH
            const result = AmountConverter.formatWithPrecision(
                baseAmount,
                CurrencySymbol.ETH
            );
            expect(result).toBe('1.230');
        });

        it('should format with custom precision', () => {
            const baseAmount = BigInt('1234000000000000000'); // 1.234 ETH
            const result = AmountConverter.formatWithPrecision(
                baseAmount,
                CurrencySymbol.ETH,
                2
            );
            expect(result).toBe('1.23');
        });

        it('should format USDC with zero decimals', () => {
            const baseAmount = BigInt('1234567'); // 1.234567 USDC
            const result = AmountConverter.formatWithPrecision(
                baseAmount,
                CurrencySymbol.USDC
            );
            expect(result).toBe('1');
        });
    });

    describe('batchFromBase', () => {
        it('should convert multiple amounts from base to display', () => {
            const amounts = [
                BigInt('1000000000000000000'), // 1 ETH
                BigInt('2000000'), // 2 USDC
            ];
            const currencies = [CurrencySymbol.ETH, CurrencySymbol.USDC];
            const result = AmountConverter.batchFromBase(amounts, currencies);
            expect(result).toEqual([1, 2]);
        });
    });

    describe('batchToBase', () => {
        it('should convert multiple amounts from display to base', () => {
            const amounts = [1, 2];
            const currencies = [CurrencySymbol.ETH, CurrencySymbol.USDC];
            const result = AmountConverter.batchToBase(amounts, currencies);
            expect(result[0].toString()).toBe('1000000000000000000');
            expect(result[1].toString()).toBe('2000000');
        });
    });

    describe('round trip conversions', () => {
        it('should maintain precision in round trip conversions', () => {
            const originalAmount = 1.5;
            const baseAmount = AmountConverter.toBase(
                originalAmount,
                CurrencySymbol.ETH
            );
            const backToDisplay = AmountConverter.fromBase(
                baseAmount,
                CurrencySymbol.ETH
            );
            expect(backToDisplay).toBe(originalAmount);
        });
    });
});
