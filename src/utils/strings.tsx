import { asciiToHex, hexToAscii, hexToNumber, rightPad } from 'web3-utils';

export const toBytes32 = (key: string) => rightPad(asciiToHex(key), 64);

export const fromBytes32 = (key: string) => {
    if (key !== null) {
        return hexToAscii(key);
    }
};

export const DEFAULT_COLLATERAL_VAULT =
    '0x62e09a147445af26edb7a67f51ae11e09ed37407';

export const toKebabCase = (str: string | undefined) =>
    str &&
    str
        .match(
            /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
        )
        ?.map((x: string) => x.toLowerCase())
        .join('-');

export const hexToDec = (key: string) => {
    if (key !== null) {
        return hexToNumber(key);
    }
};

export const capitalizeFirstLetter = (str: string): string => {
    return str ? str[0].toUpperCase() + str.slice(1) : '';
};

export const formatDataCy = (str: string): string => {
    return str.replace(/\s+/g, '-').toLowerCase();
};
