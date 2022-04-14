import { rightPad, asciiToHex, hexToAscii } from 'web3-utils';

export const toBytes32 = (key: string) => rightPad(asciiToHex(key), 64);

export const fromBytes32 = (key: string) => {
    if (key != null) {
        return hexToAscii(key);
    }
};

export const DEFAULT_COLLATERAL_VAULT =
    '0x62e09a147445af26edb7a67f51ae11e09ed37407';
