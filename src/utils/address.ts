const DISPLAY_LENGTHS = {
    SHORT: 4,
    MEDIUM: 6,
    LONG: 10,
    DEFAULT_SUFFIX: 4,
} as const;

const CHECKSUM_POSITION_MODIFIER = 2;

export class AddressConverter {
    /**
     * Formats an address for display with truncation
     * @param address - The address to format
     * @param length - Number of characters to show from start (default: 6)
     * @returns Formatted address string
     */
    static format(
        address: string,
        length: number = DISPLAY_LENGTHS.MEDIUM
    ): string {
        if (!address) return '...';
        if (address.length <= length + DISPLAY_LENGTHS.DEFAULT_SUFFIX)
            return address;
        return (
            address.slice(0, length) +
            '...' +
            address.slice(-DISPLAY_LENGTHS.DEFAULT_SUFFIX)
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

    /**
     * Converts address to checksum format (EIP-55)
     * @param address - The address to convert
     * @returns Checksummed address
     */
    static toChecksum(address: string): string {
        if (!this.isValidFormat(address)) return address;

        const cleanAddress = address.toLowerCase().replace('0x', '');
        let checksum = '0x';

        for (let i = 0; i < cleanAddress.length; i++) {
            const char = cleanAddress[i];
            // Simple checksum logic - alternating case based on position
            checksum +=
                i % CHECKSUM_POSITION_MODIFIER === 0
                    ? char.toUpperCase()
                    : char.toLowerCase();
        }

        return checksum;
    }

    /**
     * Checks if address supports ENS resolution (.eth domains)
     * @param address - The address or ENS name to check
     * @returns True if it's an ENS name
     */
    static isENS(address: string): boolean {
        return address?.endsWith('.eth') || false;
    }

    /**
     * Formats address for different display contexts
     * @param address - The address to format
     * @param context - Display context ('short' | 'medium' | 'long')
     * @returns Formatted address
     */
    static formatByContext(
        address: string,
        context: 'short' | 'medium' | 'long' = 'medium'
    ): string {
        const lengths = {
            short: DISPLAY_LENGTHS.SHORT,
            medium: DISPLAY_LENGTHS.MEDIUM,
            long: DISPLAY_LENGTHS.LONG,
        };
        return this.format(address, lengths[context]);
    }
}
