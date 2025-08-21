import { HexConverter } from './hexConverter';

describe('HexConverter', () => {
    describe('hexToNumber', () => {
        it('should convert hex string to number', () => {
            expect(HexConverter.hexToNumber('0xa')).toBe(10);
            expect(HexConverter.hexToNumber('0xff')).toBe(255);
        });
    });

    describe('numberToHex', () => {
        it('should convert number to hex string', () => {
            expect(HexConverter.numberToHex(10)).toBe('0xa');
            expect(HexConverter.numberToHex(255)).toBe('0xff');
        });
    });

    describe('hexToBigInt', () => {
        it('should convert hex string to BigInt', () => {
            expect(HexConverter.hexToBigInt('0xa')).toBe(BigInt(10));
            expect(HexConverter.hexToBigInt('0xff')).toBe(BigInt(255));
        });
    });

    describe('toHex', () => {
        it('should convert string to hex', () => {
            expect(HexConverter.toHex('ETH')).toBe(
                '0x4554480000000000000000000000000000000000000000000000000000000000'
            );
        });

        it('should convert number to hex', () => {
            expect(HexConverter.toHex(255)).toBe('0xff');
        });
    });

    describe('bigIntToHex', () => {
        it('should convert BigInt to hex', () => {
            expect(HexConverter.bigIntToHex(BigInt(255))).toBe('0xff');
        });
    });

    describe('hexToString', () => {
        it('should convert hex to string', () => {
            expect(
                HexConverter.hexToString(
                    '0x4554480000000000000000000000000000000000000000000000000000000000'
                )
            ).toBe('ETH');
        });
    });
});
