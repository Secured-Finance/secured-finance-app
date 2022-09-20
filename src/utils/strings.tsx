import { hexToNumber } from 'web3-utils';
export const hexToDec = (key: string) => {
    if (key !== null) {
        return hexToNumber(key);
    }
};

export const formatDataCy = (str: string): string => {
    return str.replace(/\s+/g, '-').toLowerCase();
};
