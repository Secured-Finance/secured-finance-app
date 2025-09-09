import {
    Hex,
    hexToBigInt,
    hexToNumber,
    hexToString,
    numberToHex,
    toHex,
} from 'viem';

export class HexConverter {
    static hexToNumber(hex: string): number {
        return hexToNumber(hex as Hex);
    }

    static numberToHex(num: number): Hex {
        return numberToHex(num);
    }

    static hexToBigInt(hex: string): bigint {
        return hexToBigInt(hex as Hex);
    }

    static toHex(value: string | number): Hex {
        return toHex(value);
    }

    static hexToString(hex: string, size = 32): string {
        return hexToString(hex as Hex, { size });
    }
}
