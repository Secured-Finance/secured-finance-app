export const AddressUtils = {
    equals: (address1: string, address2: string): boolean => {
        return address1.toLowerCase() === address2.toLowerCase();
    },
    format: (address: string, length: number): string => {
        return address.slice(0, length) + '...' + address.slice(-4);
    },
};
