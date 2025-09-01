export const DisplayLengths = {
    SHORT: 4,
    MEDIUM: 6,
    LONG: 8,
    DEFAULT_SUFFIX: 4,
};

export class AddressConverter {
    /**
     * Formats an address for display with truncation
     * @param address - The address to format
     * @param length - Number of characters to show from start (default: 6)
     * @returns Formatted address string
     */
    static format(
        address: string | undefined,
        length: number = DisplayLengths.MEDIUM
    ): string {
        if (!address || address.trim() === '') return '...';

        if (address.length <= length + DisplayLengths.DEFAULT_SUFFIX) {
            return address;
        }

        return (
            address.slice(0, length) +
            '...' +
            address.slice(-DisplayLengths.DEFAULT_SUFFIX)
        );
    }

    /**
     * Compares two addresses for equality (case-insensitive)
     * @param address1 - First address
     * @param address2 - Second address
     * @returns True if addresses are equal
     */
    static equals(address1: string, address2: string): boolean {
        return address1.toLowerCase() === address2.toLowerCase();
    }

    /**
     * Validates if an address has a valid Ethereum format
     * @param address - The address to validate
     * @returns True if address format is valid
     */
    static isValidFormat(address: string): boolean {
        if (!address) return false;
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    }
}
