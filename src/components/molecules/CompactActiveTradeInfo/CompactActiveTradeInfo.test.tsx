// import { describe, expect, it } from 'jest';
// import { hexToCurrencySymbol, isPastDate } from './CompactActiveTradeInfo';

// describe('hexToCurrencySymbol', () => {
//     it('converts hex to currency symbol', () => {
//         const hex = '0x5746494c';
//         const expected = 'wFIL';
//         expect(hexToCurrencySymbol(hex)).toBe(expected);
//     });

//     it('throws on invalid hex', () => {
//         const invalidHex = 'xyz';
//         expect(() => hexToCurrencySymbol(invalidHex)).toThrow();
//     });
// });

// describe('isPastDate', () => {
//     it('returns true for past date', () => {
//         const pastDate = Date.now() - 86400000;
//         expect(isPastDate(pastDate)).toBe(true);
//     });

//     it('returns false for future date', () => {
//         const futureDate = Date.now() + 86400000;
//         expect(isPastDate(futureDate)).toBe(false);
//     });
// });
