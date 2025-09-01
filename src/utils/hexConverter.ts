import {
    hexToBigInt,
    hexToNumber,
    hexToString,
    numberToHex,
    toHex,
} from 'viem';
export class HexConverter {
    static hexToNumber(hex: string): number {
        return hexToNumber(hex as `0x${string}`);
    }

    static numberToHex(num: number): `0x${string}` {
        return numberToHex(num);
    }

    static hexToBigInt(hex: string): bigint {
        return hexToBigInt(hex as `0x${string}`);
    }

    static toHex(value: string | number): `0x${string}` {
        return toHex(value);
    }

    static hexToString(hex: string, size = 32): string {
        return hexToString(hex as `0x${string}`, { size });
    }
}
