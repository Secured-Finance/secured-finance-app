import { AmountConverter } from './amountConverter';
import { CurrencySymbol } from './currencyList';

describe('AmountConverter', () => {
    describe('fromBase', () => {
        it('should convert valid base amounts', () => {
            expect(
                AmountConverter.fromBase(
                    BigInt('1000000000000000000'),
                    CurrencySymbol.ETH
                )
            ).toBe(1);
            expect(
                AmountConverter.fromBase(BigInt('1000000'), CurrencySymbol.USDC)
            ).toBe(1);
            expect(
                AmountConverter.fromBase(
                    BigInt('100000000'),
                    CurrencySymbol.WBTC
                )
            ).toBe(1);
            expect(AmountConverter.fromBase(1000000, CurrencySymbol.USDC)).toBe(
                1
            );
            expect(
                AmountConverter.fromBase(
                    '1000000000000000000',
                    CurrencySymbol.ETH
                )
            ).toBe(1);
        });

        it('should handle undefined or empty/invalid strings as 0', () => {
            expect(
                AmountConverter.fromBase(undefined, CurrencySymbol.ETH)
            ).toBe(0);
            expect(AmountConverter.fromBase('', CurrencySymbol.ETH)).toBe(0);
            expect(AmountConverter.fromBase('   ', CurrencySymbol.ETH)).toBe(0);
            expect(AmountConverter.fromBase('abc', CurrencySymbol.ETH)).toBe(0);
        });
    });

    describe('toBase', () => {
        it('should convert valid display amounts', () => {
            expect(
                AmountConverter.toBase(1, CurrencySymbol.ETH).toString()
            ).toBe('1000000000000000000');
            expect(
                AmountConverter.toBase(1, CurrencySymbol.USDC).toString()
            ).toBe('1000000');
            expect(
                AmountConverter.toBase(1, CurrencySymbol.WBTC).toString()
            ).toBe('100000000');
            expect(
                AmountConverter.toBase(1.5, CurrencySymbol.ETH).toString()
            ).toBe('1500000000000000000');
            expect(
                AmountConverter.toBase('1.5', CurrencySymbol.ETH).toString()
            ).toBe('1500000000000000000');
            expect(
                AmountConverter.toBase(
                    BigInt(1),
                    CurrencySymbol.WBTC
                ).toString()
            ).toBe('100000000');
        });

        it('should handle edge-case strings as 0', () => {
            expect(
                AmountConverter.toBase('', CurrencySymbol.ETH).toString()
            ).toBe('0');
            expect(
                AmountConverter.toBase('.', CurrencySymbol.ETH).toString()
            ).toBe('0');
            expect(
                AmountConverter.toBase('invalid', CurrencySymbol.ETH).toString()
            ).toBe('0');
            expect(
                AmountConverter.toBase(undefined, CurrencySymbol.ETH).toString()
            ).toBe('0');
            expect(
                AmountConverter.toBase('0.5', CurrencySymbol.ETH).toString()
            ).toBe('500000000000000000');
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
