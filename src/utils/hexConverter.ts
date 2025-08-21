export class HexConverter {
    static hexToNumber(hex: string): number {
        return parseInt(hex, 16);
    }

    static numberToHex(num: number): `0x${string}` {
        return ('0x' + num.toString(16)) as `0x${string}`;
    }

    static hexToBigInt(hex: string): bigint {
        return BigInt(hex);
    }

    static toHex(value: string | number): `0x${string}` {
        if (typeof value === 'string') {
            const bytes = new TextEncoder().encode(value);
            const hexArray = Array.from(bytes, byte =>
                byte.toString(16).padStart(2, '0')
            );
            return ('0x' + hexArray.join('').padEnd(64, '0')) as `0x${string}`;
        }
        return this.numberToHex(value);
    }

    static bigIntToHex(value: bigint): `0x${string}` {
        return ('0x' + value.toString(16)) as `0x${string}`;
    }

    static hexToString(hex: string, size = 32): string {
        const hexString = hex.startsWith('0x') ? hex.slice(2) : hex;
        const paddedHex = hexString.padStart(size * 2, '0').slice(0, size * 2);
        let result = '';

        for (let i = 0; i < paddedHex.length; i += 2) {
            const byte = parseInt(paddedHex.substr(i, 2), 16);
            if (byte !== 0) {
                result += String.fromCharCode(byte);
            }
        }

        return result;
    }
}
