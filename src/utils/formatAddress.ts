export const formatAddress = (address: string, length: number): string => {
    return address.slice(0, length) + '...' + address.slice(-4);
};
