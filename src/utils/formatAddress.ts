export const formatAddress = (address = '', length: number) => {
    return address.slice(0, length) + '...' + address.slice(-4);
};
