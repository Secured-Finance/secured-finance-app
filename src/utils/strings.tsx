import { asciiToHex, hexToAscii, rightPad, hexToNumber } from 'web3-utils';

export const toBytes32 = (key: string) => rightPad(asciiToHex(key), 64);

export const fromBytes32 = (key: string) => {
    if (key != null) {
        return hexToAscii(key);
    }
};

export const DEFAULT_COLLATERAL_VAULT =
    '0x62e09a147445af26edb7a67f51ae11e09ed37407';

export const toKebabCase = (str: string) =>
    str &&
    str
        .match(
            /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
        )
        .map(x => x.toLowerCase())
        .join('-');

export const hexToDec = (key: string): number => {
    if (key != null) {
        return hexToNumber(key);
    }
};
