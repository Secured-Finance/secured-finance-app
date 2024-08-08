// errorMessages.ts

// Error message mapping for different error signatures
const errorMapping: Record<string, string> = {
    // 'TooManyActiveOrders' corresponds to the error signature '0x28d7a641'
    // error TooManyActiveOrders();
    '0x28d7a641': 'TooManyActiveOrders',
    // More mappings can be added here...
};

/**
 * Retrieves the error message corresponding to the given signature.
 * @param signature - The custom error signature.
 * @returns The error message if found; otherwise, null.
 */
export const getErrorMessageFromSignature = (
    signature: string
): string | null => {
    return errorMapping[signature] || null;
};
