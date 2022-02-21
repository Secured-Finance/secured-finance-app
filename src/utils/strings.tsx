import { rightPad, asciiToHex, hexToAscii } from 'web3-utils';

export const toBytes32 = (key: string) => rightPad(asciiToHex(key), 64);

export const fromBytes32 = (key: string) => {
    if (key != null) {
        return hexToAscii(key);
    }
};
