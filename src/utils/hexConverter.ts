const HEX_CONSTANTS = {
    CHARACTERS_PER_BYTE: 2,
    BYTES32_CHARACTER_LENGTH: 64,
    DEFAULT_BYTE_SIZE: 32,
    HEXADECIMAL_BASE: 16,
    ZERO_PAD_CHARACTER: '0',
    BYTE_PROCESSING_STEP: 2,
} as const;

export class HexConverter {
    static hexToNumber(hex: string): number {
        return parseInt(hex, HEX_CONSTANTS.HEXADECIMAL_BASE);
    }

    static numberToHex(num: number): `0x${string}` {
        return ('0x' +
            num.toString(HEX_CONSTANTS.HEXADECIMAL_BASE)) as `0x${string}`;
    }

    static hexToBigInt(hex: string): bigint {
        return BigInt(hex);
    }

    static toHex(value: string | number): `0x${string}` {
        if (typeof value === 'string') {
            const bytes = new TextEncoder().encode(value);
            const hexArray = Array.from(bytes, byte =>
                byte
                    .toString(HEX_CONSTANTS.HEXADECIMAL_BASE)
                    .padStart(
                        HEX_CONSTANTS.CHARACTERS_PER_BYTE,
                        HEX_CONSTANTS.ZERO_PAD_CHARACTER
                    )
            );
            return ('0x' +
                hexArray
                    .join('')
                    .padEnd(
                        HEX_CONSTANTS.BYTES32_CHARACTER_LENGTH,
                        HEX_CONSTANTS.ZERO_PAD_CHARACTER
                    )) as `0x${string}`;
        }
        return this.numberToHex(value);
    }

    static bigIntToHex(value: bigint): `0x${string}` {
        return ('0x' +
            value.toString(HEX_CONSTANTS.HEXADECIMAL_BASE)) as `0x${string}`;
    }

    static hexToString(
        hex: string,
        size: number = HEX_CONSTANTS.DEFAULT_BYTE_SIZE
    ): string {
        const hexString = hex.startsWith('0x') ? hex.slice(2) : hex;
        const targetLength = size * HEX_CONSTANTS.CHARACTERS_PER_BYTE;
        const paddedHex = hexString
            .padStart(targetLength, HEX_CONSTANTS.ZERO_PAD_CHARACTER)
            .slice(0, targetLength);
        let result = '';

        for (
            let i = 0;
            i < paddedHex.length;
            i += HEX_CONSTANTS.BYTE_PROCESSING_STEP
        ) {
            const byte = parseInt(
                paddedHex.substr(i, HEX_CONSTANTS.CHARACTERS_PER_BYTE),
                HEX_CONSTANTS.HEXADECIMAL_BASE
            );
            if (byte !== 0) {
                result += String.fromCharCode(byte);
            }
        }

        return result;
    }

    static padString(
        str: string,
        length: number,
        padChar: string = HEX_CONSTANTS.ZERO_PAD_CHARACTER,
        direction: 'start' | 'end' = 'start'
    ): string {
        return direction === 'start'
            ? str.padStart(length, padChar)
            : str.padEnd(length, padChar);
    }
}
